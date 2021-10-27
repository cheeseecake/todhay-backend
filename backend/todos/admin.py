# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from .models import Todos, Habits, Projects, Wishlist
admin.site.register(Projects)
admin.site.register(Todos)
admin.site.register(Habits)
admin.site.register(Wishlist) 