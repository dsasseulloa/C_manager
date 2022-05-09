from rest_framework import generics, status, viewsets
from .serializers import ConnectionSerializer
from .models import Connection
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
import json


class ConnectionViewSet(viewsets.ModelViewSet):
    serializer_class = ConnectionSerializer
    queryset = Connection.objects.all()


class ConnectionView(generics.ListAPIView):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer


class GetConnections(generics.RetrieveAPIView):
    serializer_class = ConnectionSerializer

    def get(self, request):
        objects = Connection.objects.all()

        page = request.GET.get('page')
        per_page = request.GET.get('per_page')

        total = objects.count()
        total_pages = int(total / int(per_page))
        paginator = Paginator(objects, per_page)
        page_object = paginator.get_page(page)

        objects_data = [ConnectionSerializer(
            obj).data for obj in page_object.object_list]
        payload = {"page": page, "per_page": per_page, "total": total,
                   "total_pages": total_pages, "data": objects_data}
        return Response(payload, status=status.HTTP_200_OK)


class GetConnectionByName(APIView):

    serializer_class = ConnectionSerializer
    lookup_url_kwarg = 'name'

    def get(self, request, format=None):
        name = request.GET.get(self.lookup_url_kwarg)
        if name != None:
            connection = Connection.objects.filter(name=name)

            data = ConnectionSerializer(connection[0]).data
            return Response(data, status=status.HTTP_200_OK)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class CreateConnection(APIView):
    serializer_class = ConnectionSerializer

    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            type = serializer.data.get('type')
            ninterface = serializer.data.get('ninterface')
            description = serializer.data.get('description')
            ipv4mode = serializer.data.get('ipv4mode')
            ipv4IpAddress = serializer.data.get('ipv4IpAddress')
            ipv4BitMask = serializer.data.get('ipv4BitMask')
            ipv4Gateway = serializer.data.get('ipv4Gateway')
            ipv4Dns = serializer.data.get('ipv4Dns')
            ipv6mode = serializer.data.get('ipv6mode')
            ipv6IpAddress = serializer.data.get('ipv6IpAddress')
            ipv6Prefix = serializer.data.get('ipv6Prefix')
            ipv6Gateway = serializer.data.get('ipv6Gateway')
            ipv6Dns = serializer.data.get('ipv6Dns')
            automaticConection = serializer.data.get('automaticConection')
            primaryConection = serializer.data.get('primaryConection')
            if primaryConection is True:
                old_primary_connection = Connection.objects.filter(
                    primaryConection=primaryConection)
                if len(old_primary_connection) > 0:
                    connection = old_primary_connection[0]
                    connection.primaryConection = False
                    connection.save(update_fields=['primaryConection'])
            if Connection.objects.filter(name=name).exists():
                return Response({'message': f'A connection with this name already exists'}, status=status.HTTP_400_BAD_REQUEST)

            connection = Connection(name=name,
                                    type=type,
                                    ninterface=ninterface,
                                    description=description,
                                    ipv4mode=ipv4mode,
                                    ipv4IpAddress=ipv4IpAddress,
                                    ipv4BitMask=ipv4BitMask,
                                    ipv4Gateway=ipv4Gateway,
                                    ipv4Dns=ipv4Dns,
                                    ipv6mode=ipv6mode,
                                    ipv6IpAddress=ipv6IpAddress,
                                    ipv6Prefix=ipv6Prefix,
                                    ipv6Gateway=ipv6Gateway,
                                    ipv6Dns=ipv6Dns,
                                    automaticConection=automaticConection,
                                    primaryConection=primaryConection,)
            connection.save()
            return Response(ConnectionSerializer(connection).data, status=status.HTTP_201_CREATED)
        new_error = {}
        if serializer.errors:
            default_errors = serializer.errors
            default_errors = serializer.errors
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
        return Response({'message': f'Error in the following inputs {new_error}'}, status=status.HTTP_400_BAD_REQUEST)


class UpdateConnection(APIView):
    serializer_class = ConnectionSerializer

    def patch(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():

            name = serializer.data.get('name')
            type = serializer.data.get('type')
            ninterface = serializer.data.get('ninterface')
            description = serializer.data.get('description')
            ipv4mode = serializer.data.get('ipv4mode')
            ipv4IpAddress = serializer.data.get('ipv4IpAddress')
            ipv4BitMask = serializer.data.get('ipv4BitMask')
            ipv4Gateway = serializer.data.get('ipv4Gateway')
            ipv4Dns = serializer.data.get('ipv4Dns')
            ipv6mode = serializer.data.get('ipv6mode')
            ipv6IpAddress = serializer.data.get('ipv6IpAddress')
            ipv6Prefix = serializer.data.get('ipv6Prefix')
            ipv6Gateway = serializer.data.get('ipv6Gateway')
            ipv6Dns = serializer.data.get('ipv6Dns')
            automaticConection = serializer.data.get('automaticConection')
            primaryConection = serializer.data.get('primaryConection')
            if primaryConection is True:
                old_primary_connection = Connection.objects.filter(
                    primaryConection=primaryConection)
                if len(old_primary_connection) > 0:
                    connection = old_primary_connection[0]
                    connection.primaryConection = False
                    connection.save(update_fields=['primaryConection'])
            queryset = Connection.objects.filter(name=name)
            connection = queryset[0]
            connection.type = type
            connection.ninterface = ninterface
            connection.description = description
            connection.ipv4mode = ipv4mode
            connection.ipv4IpAddress = ipv4IpAddress
            connection.ipv4BitMask = ipv4BitMask
            connection.ipv4Gateway = ipv4Gateway
            connection.ipv4Dns = ipv4Dns
            connection.ipv6mode = ipv6mode
            connection.ipv6IpAddress = ipv6IpAddress
            connection.ipv6Prefix = ipv6Prefix
            connection.ipv6Gateway = ipv6Gateway
            connection.ipv6Dns = ipv6Dns
            connection.automaticConection = automaticConection
            connection.primaryConection = primaryConection

            connection.save(update_fields=['type',
                                           'ninterface',
                                           'description',
                                           'ipv4mode',
                                           'ipv4IpAddress',
                                           'ipv4BitMask',
                                           'ipv4Gateway',
                                           'ipv4Dns',
                                           'ipv6mode',
                                           'ipv6IpAddress',
                                           'ipv6Prefix',
                                           'ipv6Gateway',
                                           'ipv6Dns',
                                           'automaticConection',
                                           'primaryConection'])

            return Response(ConnectionSerializer(connection).data, status=status.HTTP_200_OK)
        new_error = {}
        if serializer.errors:
            default_errors = serializer.errors
            default_errors = serializer.errors
            for field_name, field_errors in default_errors.items():
                new_error[field_name] = field_errors[0]
        return Response({'message': f'Error in the following inputs {new_error}'}, status=status.HTTP_400_BAD_REQUEST)


class DeleteConnection(APIView):

    def delete(self, request, format=None):
        json_request = json.loads(request.body.decode('utf-8'))
        name = json_request.get('name')

        connection_results = Connection.objects.filter(name=name)
        if len(connection_results) > 0:
            connection = connection_results[0]
            connection.delete()

        return Response({'Message': f'{name} connection deleted'}, status=status.HTTP_200_OK)
