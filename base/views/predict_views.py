from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, OrderSerializer


from rest_framework import status
from datetime import datetime
import csv
import pandas as pd

import streamlit as st
import pickle
import numpy as np

pipe = pickle.load(open('static/model/pipe.pkl','rb'))
df = pickle.load(open('static/model/df.pkl','rb'))

    
    
@api_view(['GET', 'POST', 'DELETE'])
def getPredict(request):
    if request.method == 'GET':
        company = df['Company'].unique()
        typeName = df['TypeName'].unique()
        inches = [15.06, 14.06, 18.06, 21.60, 23.06]
        sr = ['1920x1080','1366x768','1600x900','3840x2160','3200x1800','2880x1800','2560x1600','2560x1440','2304x1440']
        cpu = df['Cpu brand'].unique()
        ram = df['Ram'].unique();
        gpu = df['Gpu brand'].unique()
        ops = df['os'].unique()
        memory = df['HDD'].unique()
        weight = df['Weight'].unique()
        ssd = [0, 8, 128, 256, 512, 1024]
        return Response({'lc': company, 'ltn': typeName, 'lsr': sr, 'lcpu': cpu,
        'lram': ram, 'lgpu': gpu, 'lops': ops, 'lmr': memory, 'lw': weight, 'li': inches, 'ssd': ssd})

    if request.method == 'POST':
        data = request.data
        data = data['datas']
        company = data['lep_company']
        name = data['lep_name']
        screen_size = float(data['lep_inches'])
        resolution = data['lep_screenResolution']
        cpu = data['lep_cpu']
        ram = data['lep_ram']
        hdd = data['lep_memory']
        ssd = data['lep_ssd']
        gpu = data['lep_gpu']
        os = data['lep_opSys']
        weight = data['lep_weight']
        touchscreen = data['lep_touchscreen']
        ips = data['lep_ips']
        if touchscreen == 'yes':
             touchscreen = 1
        else:
            touchscreen = 0

        if ips == 'yes':
           ips = 1
        else:
           ips = 0          
        print("Res : ", resolution)   
        print("cpu : ", cpu)
        print("name : ", name)
        X_res = int(resolution.split('x')[0])
        Y_res = int(resolution.split('x')[1])
        ppi = ((X_res**2) + (Y_res**2))**0.5/screen_size
        query = np.array([company, name, ram, weight, touchscreen,ips, ppi, cpu, hdd, ssd, gpu, os])
        query = query.reshape(1, 12)
        predict = int(np.exp(pipe.predict(query)[0]))
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response({'predict': predict, 'suggest_products': serializer.data})

