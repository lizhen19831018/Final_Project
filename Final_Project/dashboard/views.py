from django.shortcuts import render
from django.http import HttpResponse
from django.http import Http404

import json
#from bson import BSON
from bson import json_util
from pymongo import MongoClient

def dashboard(request):
    client = MongoClient('mongodb+srv://dpAdmin:dpAdmin@cluster0-ituus.mongodb.net/test?retryWrites=true&w=majority')
    db = client.twitter
    collection = db['twitter']
    cursor = collection.aggregate(
        [
            {"$group": {"_id": "$lang", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
    )

    lang_data = list()
    for document in cursor:
        final = json.dumps(document, indent=0, default=json_util.default)
        lang_data.append(final)

    
    cursor = collection.aggregate(
        [
            {"$match": {"place.country": {"$exists": True, "$ne": None}}},
            {"$group": {"_id": "$place.country", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
    )

    country_data = list()
    for document in cursor:
        final = json.dumps(document, indent=0, default=json_util.default)
        country_data.append(final)

    return render(request, 'home.html', {'lang_data': lang_data, 'counrty_data': country_data})

def ajax_dashboard(request):
    print("in")
    if request.is_ajax():
        print("start")
        client = MongoClient('mongodb+srv://dpAdmin:dpAdmin@cluster0-ituus.mongodb.net/test?retryWrites=true&w=majority')
        db = client.twitter
        collection = db['twitter']
        cursor = collection.aggregate(
            [
                {"$group": {"_id": "$lang", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 5}
            ]
        )

        lang_data = list()
        for document in cursor:
            final = json.dumps(document, indent=0, default=json_util.default)
            lang_data.append(final)

        cursor = collection.aggregate(
            [
                {"$match": {"place.country": {"$exists": True, "$ne": None}}},
                {"$group": {"_id": "$place.country", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 10}
            ]
        )

        country_data = list()
        for document in cursor:
            final = json.dumps(document, indent=0, default=json_util.default)
            country_data.append(final)

        json_data = []
        json_data.append(lang_data)
        json_data.append(country_data)

        print("end")
        return HttpResponse(json.dumps(json_data), content_type='application/json')