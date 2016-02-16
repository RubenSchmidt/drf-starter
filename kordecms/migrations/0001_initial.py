# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Article',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField(verbose_name='text', blank=True)),
                ('title', models.TextField(verbose_name='title', blank=True)),
                ('author_name', models.TextField(verbose_name='author name', blank=True)),
                ('last_updated', models.DateTimeField(auto_now=True, verbose_name='last updated')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='created at')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, verbose_name='author', to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'verbose_name': 'article',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ArticleComment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('text', models.TextField(verbose_name='comment text', blank=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('article', models.ForeignKey(verbose_name='article', to='kordecms.Article')),
                ('author', models.ForeignKey(verbose_name='article author', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'article comment',
            },
            bases=(models.Model,),
        ),
    ]
