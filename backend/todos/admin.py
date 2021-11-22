# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from todos.models import Tag, List, Todo, Wishlist
admin.site.register(Tag)
admin.site.register(List)
admin.site.register(Todo)
admin.site.register(Wishlist) 