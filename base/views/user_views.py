import http.client
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from django.contrib.auth.models import User
from base.serializers import ProductSerializer, UserProfileSerilizer, UserSerializer, UserSerializerWithToken
# Create your views here.
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.hashers import make_password
from rest_framework import status
from base.models import  TempUser, UserProfile
from django.db.models import Sum
import random
import http.client
from django.conf import settings
from base.views.helper_file.otp import *

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer





@api_view(['GET'])
def getUserCoins(request, pk):
    print("user  :: ", pk)
    coins = list(UserProfile.objects.filter(
        user_id=pk).aggregate(Sum('coins')).values())[0]
    print("coins : ->>>>>>", coins)
    return Response(coins)


@api_view(['POST'])
def tempRegister_user(request):
    data = request.data
    print("data ::: ", data)

    #for otp
    otp = str(random.randint(1000, 9999))
    mobile = data['mobile']
    email = data['email']
    check_user = User.objects.filter(email=email).first()
    check_profile = UserProfile.objects.filter(mobile=mobile).first()

    if(check_profile):
        message = 'User with this mobile already exists'
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    elif(check_user):
        message = 'User with this email already exists'
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

    x = send_otp(email, otp)
    print("This is  $$$$$", x)
    if not x:
        message = 'Your given email is not authenticated in gmail'
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

        #for user
    user = TempUser.objects.create(
        temp_user_firstName=data['name'],
        temp_user_name = data['email'],
        temp_user_email=data['email'],
        temp_user_mobile=data['mobile'],
        temp_user_otp=otp,
        temp_user_password=make_password(data['password'])
    )
    #for otp user
    
    print("I am OKKKK!! ", email)
    return Response(email)


@api_view(['POST'])
def registerUser_with_otp(request):
    data = request.data
    email = data['email']
    otp = data['otp']
    temp_user = TempUser.objects.filter(temp_user_email=email).first()
    if otp == temp_user.temp_user_otp:
        user = User.objects.create(
            first_name=temp_user.temp_user_firstName,
            username=temp_user.temp_user_email,
            email=temp_user.temp_user_email,
            password=make_password(temp_user.temp_user_password)
        )
        profile = UserProfile(user=user, mobile=temp_user.temp_user_otp, otp=temp_user.temp_user_otp)
        profile.save()
        temp = TempUser.objects.get(temp_user_email=email)
        temp.delete()
    else:
        message = {'detail': 'Your Otp is not match'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)       
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def otp_verification(request):
    email = request.session['email']
    if request.method == 'POST':
        otp = request.POST.get('otp')
        profile = UserProfile.objects.filter(email=email).first()
        if otp == profile.otp:
            pass
        else:
            pass
             


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request, pk):
    user = User.objects.get(id=pk)

    data = request.data

    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    userForDeletion = User.objects.get(id=pk)
    userForDeletion.delete()
    return Response('User was deleted')


@api_view(['POST'])
def resetPassword(request):
    data = request.data 
    email = data['email']
    try:
        user = User.objects.get(email=email)
        return Response({'email': email, 'result': True})
    except:
        return Response({'email': email, 'result': False})
        
        
        
    
