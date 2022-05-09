from django.urls import path
from .views import ConnectionView, CreateConnection, GetConnections, GetConnectionByName, UpdateConnection, DeleteConnection

urlpatterns = [
    path('connection', GetConnectionByName.as_view()),
    path('connections', ConnectionView.as_view()),
    path('get-connections', GetConnections.as_view()),
    path('create-connection', CreateConnection.as_view()),
    path('update-connection', UpdateConnection.as_view()),
    path('delete-connection', DeleteConnection.as_view()),

]
