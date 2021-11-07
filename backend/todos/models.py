# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.utils import timezone

# Create your models here.
class Projects(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=20, choices=
                                (
                                ('Personal','Personal'),
                                ('Work','Work')),
                                default ='Personal'
                                )                
    title = models.CharField(max_length=40)
    description = models.TextField(blank=True, default='')
    startdate = models.DateField(default=timezone.now)
    duedate = models.DateField(blank=True, null=True)
    completedate = models.DateField(blank=True, null=True)
    class Meta:
        verbose_name_plural = ("Projects")
        ordering = ['type', 'startdate']

class baseTodos(models.Model): 
    id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name='todos', blank=True, null=True)
    title = models.CharField(max_length=40)
    description = models.TextField(blank=True, default='')
    effort = models.DecimalField(max_digits=6, decimal_places=2, default=0.5)
    reward = models.DecimalField(max_digits=6, decimal_places=2, default=0.5)
    class Meta:
        verbose_name_plural = ("baseTodos")


class Habits(baseTodos): 
    category = models.CharField(max_length=20, choices=
                                (('Learning','Learning'),
                                ('Financial','Financial'),
                                ('Health','Health'),
                                ('Social','Social')),
                                default ='Learning'
                                )       
    frequency = models.CharField(max_length=20, choices=
                                (('Daily','Daily'),
                                ('Weekly','Weekly'),
                                ('Monthly','Monthly'),
                                ('Quarterly','Quarterly'),
                                ('Yearly', 'Yearly')),
                                default ='Daily'
                                )
    enddate = models.DateField(blank=True, null=True)                 
    def __str__(self):
        return self.title
                                 
    class Meta:
        verbose_name_plural = "Habits"
        ordering = ['category', 'frequency']

class Todos(baseTodos):
    habit = models.ForeignKey(Habits, on_delete=models.CASCADE, related_name='habittodos', blank=True, null=True)
    startdate = models.DateField(default=timezone.now)
    duedate =  models.DateField(default=timezone.now)
    completedate = models.DateField(blank=True, null=True)      
               
    class Meta:
        verbose_name_plural = "Todos"
        ordering = ['-completedate', 'duedate', 'startdate']

class Wishlist(models.Model):  
    id = models.AutoField(primary_key=True)        
    title = models.CharField(max_length=40)
    cost = models.DecimalField(max_digits=6, decimal_places=2)
    imgurl = models.CharField(max_length=400, null=True)
    producturl = models.CharField(max_length=400, null=True, blank=True)
    count = models.IntegerField(default=0, null=True)
    repeat = models.BooleanField(default=False)
    class Meta:
        verbose_name_plural = ("Wishlist")
        ordering = ['-repeat','count', 'cost']

