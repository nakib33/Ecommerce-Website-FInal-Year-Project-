import os
from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from base.models import Coupon, CouponRedemption, Product, Review, Profit
from base.serializers import CouponRedemptionSerializer, CouponSerializer, ProductSerializer, Price_History_Serializer, Profit_Serializer
import datetime
from rest_framework import status
from base.views.helper_file.history_model import *

@api_view(['GET'])
def getCoupons(request):
    #x = datetime.datetime.now()
    coupon_red = CouponRedemption.objects.all(is_used=False)
    coupon_redemptions = CouponRedemptionSerializer(coupon_red, many=True)
    coup = Coupon.objects.all()
    coupons = CouponSerializer(coup, many=True)
    return Response({'coupon_redemptions': coupon_redemptions.data, 'coupons': coupons.data})

@api_view(['POST'])
def getCouponStatus(request):
    data = request.data
    print("data ---->>>>>>>>>>>>>>>>>>>>>>>>>>>>>", data);
    user_id = data['user_id']
    coupon_code = data['coupon_code']
    print("USER COUPON  ", user_id, coupon_code)
    coupon_redemption = CouponRedemption.objects.filter(
        user_id=user_id).filter(coupon_code=coupon_code).filter(is_used=False)
    cpn = CouponRedemption.objects.get(user_id=user_id)
    print("Coupon ######### ----->>>>> : ", cpn.total_discount)
    if coupon_redemption:    
        total_discount = cpn.total_discount
        codee = cpn.id
        print(codee)
        return Response({'status': 3, 'total_discount': total_discount, 'coupon_id': codee})
    else:
        return Response({'status': 2, 'total_discount': 0})
    
    
    
    
    


@api_view(['GET'])
# for get products
def getProducts(request):
    coupon_red = CouponRedemption.objects.all()
    coupon_redemption = CouponRedemptionSerializer(coupon_red, many=True)
    query = request.query_params.get('keyword')
    if query == None:
        query = ''
        products = Product.objects.filter(
            name__icontains=query).order_by('-createdAt')
    elif query == 'linux' or query == 'windows' or query == 'mac' or query == 'android':
        products = Product.objects.filter(
            operating_system=query).order_by('-createdAt')
        
    elif query[-3:] == "RAM":
        query = int(query[:-3])
        products = Product.objects.filter(ram_memory=query).order_by('-createdAt')
        
    else:
        products = Product.objects.filter(
            name__icontains=query).order_by('-createdAt')


    page = request.query_params.get('page')
    paginator = Paginator(products, 8)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)
    print('Page:', page)
    serializer = ProductSerializer(products, many=True)
    
    product_price_history = ProductPriceHistory.objects.all()
    price_history = Price_History_Serializer(product_price_history, many=True)
    
    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})


@api_view(['GET', 'POST'])
def getAllProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    if request.method == 'POST':
        data = request.data
        pro1 = data['id_1']
        pro2 = data['id_2']
       
        if pro1 and pro2:
            product_price_history1 = ProductPriceHistory.objects.filter(
                product=pro1).order_by('createdAt')  # -createdAt // reverse
            price_history1 = Price_History_Serializer(product_price_history1, many=True)
            product_price_history2 = ProductPriceHistory.objects.filter(
                product=pro2).order_by('createdAt')  # -createdAt // reverse
            price_history2 = Price_History_Serializer(
                product_price_history2, many=True) 
            return Response({'products': serializer.data, 'price_history1': price_history1.data, 'price_history2': price_history2.data})
    return Response(serializer.data)


#for get top products

@api_view(['GET'])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getOfferProducts(request):
    print("hello 1")
    products = Product.objects.filter(is_offer=True).order_by('-offer_percentage')[0:5]
    print("Products :",products)
    print("hello 2")
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET','POST'])
def getProduct(request, pk):
    product_price_history = ProductPriceHistory.objects.filter(
        product=pk).order_by('createdAt') #-createdAt // reverse
    price_history = Price_History_Serializer(product_price_history, many=True)
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response({'product': serializer.data, 'price_history': price_history.data})


def getProduct_cart(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def predict_history_price(request):
   # print("hello I am Called !!!!!!!!!!!!!!!!!!!!")
    #print(request.data['date'], request.data['product_id'])
    date = request.data['date']
    product_id = request.data['product_id']
    predictFuture_price = history_model(date, product_id)
    return Response(predictFuture_price)
        
    


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user

    product = Product.objects.create(
        user=user,
        category='Sample Category',
        brand='Sample Brand',
        name='Sample Name',
        model='Sample Model',
        processor = 'Simple Processor',
        display = 'Simple Display',
        graphics_card = 'Simple Graphics Card',
        ram_memory = 0,
        storage = 'Simple Storage',
        operating_system = 'OS',
        web_cam = 'web cam',
        weight = 'weight',
        color = 'color',
        battery = 'battery',
        warranty = 'warranty',
        price=0,
        countInStock=0,
        description='',
        is_offer='',
        offer_percentage=0
    )

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(_id=pk)
    product.category = data['category']
    product.brand = data['brand']
    product.name = data['name']
    product.model = data['model']
    product.processor = data['processor']
    product.display = data['display']
    product.graphics_card = data['graphics_card']
    product.ram_memory = data['ram_memory']
    product.storage = data['storage']
    product.operating_system = data['operating_system']
    product.web_cam = data['web_cam']
    product.weight = data['weight']
    product.color = data['color']
    product.battery = data['battery']
    product.warranty = data['warranty']
    product.price = data['price']
    product.countInStock = data['countInStock']
    product.description = data['description']
    product.is_offer = data['is_offer']
    product.offer_percentage = data['offer_percentage']

    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Producted Deleted')


@api_view(['POST'])
def uploadImage(request):
    data = request.data
    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)
    
    if request.FILES.get('image'):
        product.image = request.FILES.get('image')
        product.save()
    elif request.FILES.get('image2'):
        product.image2 = request.FILES.get('image2')
        product.save()
    elif request.FILES.get('image3'):
        product.image3 = request.FILES.get('image3')
        product.save()
            
    return Response('Image was uploaded')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # 1 - Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2 - No Rating or 0
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3 - Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review Added')


@api_view(['GET'])
def dashboard(request): 
    pending_order = 0
    profit = Profit.objects.all().order_by('year')
    serializer = Profit_Serializer(profit, many=True)
    for e in Order.objects.all():
        print("EEEE", e.isDelivered)
        pending_order += 1
    new_user = 0    
    for u in User.objects.all():
        new_user += 1
        
   # from datetime import date
    #current_date = datetime.today()
   # current_year = current_date.year
   # new_users = User.objects.filter(date_year=current_year)
    #new = new_users.count()
    revenue = 300000.30
    return Response({'pending_orders': pending_order, 'new_users': new_user, 'revenue': revenue, 'profit': serializer.data})

    
            
    
            
            
    
     
