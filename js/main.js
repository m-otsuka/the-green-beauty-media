var allBrands1 = "ANDALOUnaturals AromatherapyAssociates ケアオブヤード EO herbfarmacy ジョンマスターオーガニック jurlique MiMC ニールズヤードレメディーズ";
var allBrands2 = "nahrin オーガニックファーマシー PHYT'S QUON rms SANTAVERDE シンピュルテ SHIGETA trilogy WELEDA Zuii";

var cosmeticsId = '100939';
var skinCareId = '100944';
var bodyCareId = '100960';
var hairCareId = '100940';
var makeUpId = '204233';

function addPagination(pageCount, page) {
  for(var i = 1; i <= pageCount; i++) {
    if(page == i) {
        $('.pagination').append('<li class="page-number"><a href="#" class="current">' + i + '</a></li>');
    } else {
        $('.pagination').append('<li class="page-number"><a href="#">' + i + '</a></li>');
    }
  }
}

function getItems(keyword, orFlag, genreId, hits, page) {

  var parameters =  $.param({
    format: 'json',
    keyword: keyword,
    orFlag: orFlag,
    NGKeyword: '並行輸入 送料無料',
    genreId: genreId,
    hits: hits,
    page: page,
    imageFlag: 1,
    applicationId: '1025619994075419351',
  });
  
  var rakutenUrl = 'https://app.rakuten.co.jp/services/api/IchibaItem/Search/20140222?' + parameters;
  
  $.getJSON(rakutenUrl, function(data) {
    if (data.count > 0) {
      
      for(var i = 0; i < data.Items.length; i++) {
        var item = data.Items[i].Item;
        var itemUrl = item.itemUrl;
        var imageUrl = item.mediumImageUrls[0].imageUrl;
        var itemName = item.itemName;
        if (itemName.length > 30) {
            itemName = itemName.substring(0, 30) + '&hellip;';
        }
        var itemPrice = item.itemPrice;
        var htmlTemplate = $('<div class="wrapper col-xs-6 col-sm-4 col-md-3 col-lg-2">' +
            '<div class="item-holder">' +
            '<div class="img-holder">' +
            '<a href="' + itemUrl + '" target="_blank">' +
            '<img src="' + imageUrl + '" alt="' + item.itemName + '">' +
            '</a></div>' +
            '<h3 class="item-name"><a href="' + itemUrl + '" target="_blank">' + itemName + '</a></h3>' +
            '<div class="item-price">&yen;' + itemPrice + '</div>' +
            '</div></div>');
  
        $('#items-container').append(htmlTemplate);
      }
      
      $('.pagination').empty();
      var pageCount = data.pageCount;
      if(pageCount > 5) {
        addPagination(5, page);
      } else if(pageCount <= 5) {
        addPagination(pageCount, page);
      }
    } else  {
      $('#items-container').append('<div>No results found.</div>');
    }
  });
}

function getAllItems(genreId, page) {
  $('#items-container').empty();
  getItems(allBrands1, 1, genreId, 15, page);
  getItems(allBrands2, 1, genreId, 15, page);
}

function showItems(page) {
  var hash = location.hash;
  if(hash === '') {
    getAllItems(cosmeticsId, page);
    
  } else if(hash) {
    $('.menu-item a').removeClass('active');
    $('.menu-item a[href="' + hash + '"]').addClass('active');
    
    if(hash === '#all') {
      getAllItems(cosmeticsId, page);
      
    } else if (hash.indexOf('#category-') === 0) {
      switch(hash) {
        case '#category-skincare':
          getAllItems(skinCareId, page);
          break;
        case '#category-bodycare':
          getAllItems(bodyCareId, page);
          break;
        case '#category-haircare':
          getAllItems(hairCareId, page);
          break;
        case '#category-makeup':
          getAllItems(makeUpId, page);
          break;
      }
      
    } else if (hash.indexOf('#brand-') === 0) {
      $('#items-container').empty();
      var brandName = $('a[href="' + hash + '"]').text();
      getItems(brandName, 0, cosmeticsId, 30, page);
    }
  }
}


$(document).ready(function() {
  
  showItems(1);
  
  window.onhashchange = function(){
    showItems(1);
    $("html,body").animate({scrollTop:0}, 300);
  };
  
  $(document).on('click', '.page-number a', function() {
    var pageNumber = $(this).text();
    showItems(pageNumber);
    $('html,body').animate({scrollTop:0}, 300);
    return false;
  });
  
  $('.menu-trigger-icon').click(function() {
    $('#menu').fadeToggle(300);
    $(this).toggleClass('active');
    return false;
  });
  
  $(window).on('load resize', function(){
    if($(window).width() < 768) {
      $('#menu').css('display', 'none');
    } else {
      $('#menu').css('display', 'block');
      $('.menu-trigger-icon').removeClass('active');
    }
  });
  
  $('.menu-item a').click(function() {
    if($(window).width() < 768) {
      $('#menu').fadeOut(300);
      $('.menu-trigger-icon').removeClass('active');
    }
  });
  
});