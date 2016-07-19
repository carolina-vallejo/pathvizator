function CircleGraph(radio2, data,svgwrap){
  var svgns = "http://www.w3.org/2000/svg";

  //this
  var self = this;
//  self.radio=radio;
  
  self.svgwrap=svgwrap;

  //styling
  var palette=['#00BBD3','#9B26AF','#6639B6','#3E50B4','#2095F2','#02A8F3','#009587','#4BAE4F','#8AC249','#CCDB38','#FEEA3A','#FEC006','#FE9700','#FE5621','#F34235','#E81D62','#785447','#9D9D9D','#5F7C8A'];
  var offorig=80;//offset para centrar toda la grafica
  var factorsize=20;//ancho del circulo
  var gradescircle=360;

  //coordenadas
  var coords = []; 
  var angles=[];  

  //data
  //var data=[50, 50, 50, 50, 10,2,10,5,2,5,5,5,5,10,10,10,3,4,4,3,2,2,200];

//pres
  var radio=40;

  self.inicio=function(){
     self.draw();
  };

  
  self.draw= function(){

    
    self.coordenadas(data);

    for(var i=0; i<data.length; i++){

      self.svgdonut(i);
      //self.svgcirclesys(i);

    }//--->final for
      
  };//---> function coordenadas
  self.coordenadas = function (data){

    var sum=sumelemarr(data);

    for(var i=0; i<sum.length; i++){


      var x1= (Math.sin(Math.radians(sum[i]))*radio) + offorig;
      var y1= (Math.cos(Math.radians(sum[i]))*radio) + offorig;


      var x2= (Math.sin(Math.radians(sum[i]))*(radio+factorsize)) + offorig;
      var y2= (Math.cos(Math.radians(sum[i]))*(radio+factorsize)) + offorig;

      coords.push({x1: x1, y1: y1, x2: x2, y2: y2});

       
    }//--->final for

  };//-->final circle coords

  self.svgdonut = function(i){
    var aPath3 = document.createElementNS(svgns, 'path');
    aPath3.setAttribute( 'stroke', 'white');
    aPath3.setAttribute( 'stroke-width', 1);  
    aPath3.setAttribute( 'fill', palette[i%5]);        
    document.getElementById(svgwrap).appendChild(aPath3); 

    aPath3.setAttribute('d', 
    ' M' + coords[i].x1 +','+ coords[i].y1 +
    ' A'+ '-'+(radio)+' '+(radio)+' 0 '+ ( angles[i] < 180 ? 0 : 1) +' 0 '+ coords[i+1].x1 +' '+ coords[i+1].y1 +
    ' L' + lastcoor(i,'x2') +','+ lastcoor(i,'y2') +
    ' A'+ '-'+(radio+factorsize)+' '+(radio+factorsize)+' 0 '+ ( angles[i] < 180 ? 0 : 1) +' 1 '+ coords[i].x2  +' '+ coords[i].y2 +
    ' Z'
    );


  };
  self.svgcirclesys = function(i){
      var aPath = document.createElementNS(svgns, 'path');
      aPath.setAttribute( 'stroke', 'black');        
      document.getElementById(svgwrap).appendChild(aPath);

      aPath.setAttribute('d', 
      ' M' + coords[i].x1 +','+ coords[i].y1 +
      ' L' + coords[i].x2 +','+ coords[i].y2 
      );

      //---
      var aCircle = document.createElementNS(svgns, 'circle');
      aCircle.setAttribute('stroke', 'black'); 
      aCircle.setAttribute('fill', 'none');        
      document.getElementById(svgwrap).appendChild(aCircle);

      aCircle.setAttribute('r', 10);
      aCircle.setAttribute('cx', coords[i].x2);
      aCircle.setAttribute('cy', coords[i].y2);
      aCircle.setAttribute('z-index', -1);

  };
  self.svgtext = function(){

  };

  ///////////////////////////
  /// Auxiliary functions ///
  ///////////////////////////

  function normalizevals(arr){
      var total = 0;
      var totalnorm=0;

      for(var i=0; i<arr.length;i++){
          total += arr[i];
      }
      for(i=0; i<arr.length;i++){
          arr[i] = ((arr[i]) / total) * gradescircle;
          totalnorm+=arr[i];
      }
      return arr;
  }

  function sumelemarr(arr){
    angles =normalizevals(arr);
    var arrsum=[0];
    var total=0;

    for(var i=0; i<angles.length;i++){
      total += angles[i];
      
      if(i !== 0){
        arrsum[i+1]=total; 
      }else{
        arrsum[i+1]=angles[i];
      }
    }
    return arrsum;
  }

  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };

  function rand(){
    return Math.floor((Math.random() * 100) + 1);
  }

  function lastcoor(i, coor){


    if(i<data.length){
      return coords[i+1][coor];
      
    }else{
      return coords[0][coor];
            
    }
  }
  function middlepoint(x1, y1, x2, y2){
    var center=[ (x1+x2)/2, (y1+y2)/2 ];
    return center;
  }

}//---->CIRCLE

