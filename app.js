(function($, doc) {

  'use strict';
  
  function app() {
    return {

      init: function init() {
        this.companyInfo();
        this.initEvents();
        app().getVehicle();
      },

      initEvents: function initEvents() {
        var $formVehicle = $('[data-js="form-insert-vehicle"]');
        $formVehicle.on('submit', this.handleVehicles);
      },

      companyInfo: function companyInfo() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'company.json');
        ajax.send();
        ajax.addEventListener('readystatechange',this.getInfoCompany, false);
      },

      getInfoCompany: function getInfoCompany() {
        if (app().isRequestOk.call(this)) {
          var data = JSON.parse(this.responseText);
          $('[data-js="title"]').get()[0].textContent = data.name;
          $('[data-js="number"]').get()[0].textContent = data.phone;
        }
      },

      isRequestOk: function isRequestOk() {
        return this.readyState === 4 && this.status === 200;
      },

      vehicle: function vehicle() {
        var $vehicle = $('[data-js="input-field"]');   
        return {
          image      : $vehicle.get()[0].value,
          brandModel : $vehicle.get()[1].value,
          year       : $vehicle.get()[2].value,
          plate      : $vehicle.get()[3].value,
          color      : $vehicle.get()[4].value
        }
      },

      handleVehicles: function handleVehicles(event) {
        event.preventDefault();   
        app().removeFirstLine();     
        app().addVehicle();
        app().getVehicle(); 
      },

      addVehicle: function addVehicle() {
        var vehicle = this.vehicle();
        var ajax = new XMLHttpRequest();
        ajax.open('POST', 'http://localhost:3000/car');
        ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        ajax.send('image=' + vehicle.image + '&brandModel=' + vehicle.brandModel + '&year=' + vehicle.year + '&plate=' + vehicle.plate + '&color=' + vehicle.color + '');
      },

      getVehicle: function getVehicle() {
        var ajax = new XMLHttpRequest();
        ajax.open('GET', 'http://localhost:3000/car');
        ajax.send();
        ajax.addEventListener('readystatechange',this.setVehicle, false);
      },

      setVehicle: function setVehicle() {
        if (app().isRequestOk.call(this)) {
          var data = JSON.parse(this.responseText);
          data.forEach( app().addVehicleTable );
        }
      },

      addVehicleTable: function addVehicleTable(vehicle) {
        var $table = app().table();
        var counter = 1;
        console.log('bla');
        $table.bodyTable.get()[0].insertAdjacentHTML('beforeend', $table.lineTable);
        for (const detailVehicle in vehicle) {
           $table.bodyTable.get()[0].children[counter].innerHTML = $table.bodyTable.get()[0].children[counter].innerHTML + $table.columnTable.replace(/\[Content\]/, vehicle[detailVehicle]) ;
          //td.innerHTML(  )
        }
      },

      table: function table() {
        return {
          bodyTable         : $('[data-js="table-body"]'),
          lineTable         : '<tr></tr>',
          imageTable        : doc.createElement("img"),
          columnTable       : '<td> [Content] </td>',
          optionRemoveTable : '<td data-js="remove-vehicle" > <a href="#"> Remover veiculo </a> </td>' 
        }
      },

      clearFields: function clearFields(item) {
        item.value = '';
      }, 

      removeFirstLine: function removeFirstLine() {
        var lineTable = $('[data-js="empty-register"]');
        var element = lineTable.get()[0].children[0];
        element.setAttribute ( "style", "display:none;" );
      }
      
    }
  }

  app().init();

})(window.DOM, document);
