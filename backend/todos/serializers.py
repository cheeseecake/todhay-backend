from rest_framework import serializers
from todos.models import List, Todo, Tag, Wishlist

# Most of the logic has been moved to the frontend
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = "__all__"

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields =   "__all__"
    
class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = "__all__"

