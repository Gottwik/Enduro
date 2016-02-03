/**
 * 0.0.2
 * local storage
 * 
 * @ flatfull.com All Rights Reserved.
 * Author url: http://themeforest.net/user/flatfull
 */
(function() {
  'use strict';
  angular
    .module('ngStore', [])
    .provider('ngStore', ngStoreProvider)
    .factory('ngStoreFactory', ngStoreFactory);
    
    function ngStoreProvider(){
      return {
        $get: ['ngStoreFactory', function(ngStoreFactory) {
          return {
            model: function(name) {
              var model = new ngStoreFactory(name);
              return model;
            }
          };
        }]
      };
    }

    function ngStoreFactory(){

      function Store(name, serializer) {
        if( !this.localStorage ) {
          throw "localStorage: Environment does not support localStorage."
        }
        this.name = name;
        this.serializer = serializer || {
          serialize: function(item) {
            return isObject(item) ? JSON.stringify(item) : item;
          },
          // fix for "illegal access" error on Android when JSON.parse is passed null
          deserialize: function (data) {
            return data && JSON.parse(data);
          }
        };
        var store = this.localStorage().getItem(this.name);
        this.records = (store && store.split(",")) || [];
      };

      Store.prototype = {

        // Save the current state of the **Store** to *localStorage*.
        save: function() {
          this.localStorage().setItem(this.name, this.records.join(","));
        },

        // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
        // have an id of it's own.
        create: function(model) {
          if (!model.id && model.id !== 0) {
            model.id = guid();
            model.set(model.idAttribute, model.id);
          }
          this.localStorage().setItem(this._itemName(model.id), this.serializer.serialize(model));
          this.records.push(model.id.toString());
          this.save();
          return this.find(model);
        },

        // Update a model by replacing its copy in `this.data`.
        update: function(model) {
          this.localStorage().setItem(this._itemName(model.id), this.serializer.serialize(model));
          var modelId = model.id.toString();
          if (!contains(this.records, modelId)) {
            this.records.push(modelId);
            this.save();
          }
          return this.find(model);
        },

        // Retrieve a model from `this.data` by id.
        find: function(model) {
          return this.serializer.deserialize(this.localStorage().getItem(this._itemName(model.id)));
        },

        // Return the array of all models currently in storage.
        findAll: function() {
          var result = [];
          for (var i = 0, id, data; i < this.records.length; i++) {
            id = this.records[i];
            data = this.serializer.deserialize(this.localStorage().getItem(this._itemName(id)));
            if (data != null) result.push(data);
          }
          return result;
        },

        // Delete a model from `this.data`, returning it.
        destroy: function(model) {
          this.localStorage().removeItem(this._itemName(model.id));
          var modelId = model.id.toString();
          for (var i = 0, id; i < this.records.length; i++) {
            if (this.records[i] === modelId) {
              this.records.splice(i, 1);
            }
          }
          this.save();
          return model;
        },

        nextId: function(){
          return this.records.length == 0 ? 1 : Number(this.records[this.records.length - 1]) + 1;
        },

        localStorage: function() {
          return localStorage;
        },

        // Clear localStorage for specific collection.
        _clear: function() {
          var local = this.localStorage(),
            itemRe = new RegExp("^" + this.name + "-");

          // Remove id-tracking item (e.g., "foo").
          local.removeItem(this.name);

          // Match all data items (e.g., "foo-ID") and remove.
          for (var k in local) {
            if (itemRe.test(k)) {
              local.removeItem(k);
            }
          }

          this.records.length = 0;
        },

        // Size of localStorage.
        _storageSize: function() {
          return this.localStorage().length;
        },

        _itemName: function(id) {
          return this.name+"-"+id;
        }

      };

      return Store;

      // Generate four random hex digits.
      function S4() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };

      // Generate a pseudo-GUID by concatenating random hexadecimal.
      function guid() {
         return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
      };

      function isObject(item) {
        return item === Object(item);
      }

      function contains(array, item) {
        var i = array.length;
        while (i--) if (array[i] === item) return true;
        return false;
      }
    }

})();
