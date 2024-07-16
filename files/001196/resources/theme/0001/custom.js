jQuery.fn.reload = function() {
    this.each(function(index){
        var url=$(this).attr('data-src');
        $(this).load(url);
    } );
}

function getEmAddr(name,dom,addMt){
    var addr='';
    if(addMt){
        addr+='ma';
        addr+='il';
        addr+='to:';
    }
    addr+=name;
    addr+='@';
    addr+=dom;
    return addr;
}


$(document).on('click', 'a.checkout-button,button.checkout-button', function() {
	$(this).find('i').removeClass('fa-arrow-circle-right');
	$(this).find('i').addClass('fa-spinner fa-spin');
	$(this).prop('disabled', true);
    //$('#cart-checkout-footer').find('#cart-checkout-submit-failed').hide();
				
    RC.Server.Cart.checkout('',{
	    failure:function(context,msg,xml,jqXHR) {
			//$('#cart-checkout-footer').find('#cart-checkout-submit-failed').show();
			$(this).prop('disabled', false);
			$(this).removeClass('fa-spinner fa-spin');
			$(this).addClass('fa-arrow-circle-right');
			//$('#cart-checkout-footer').find('#cart-checkout-submit-error').html(msg);
	    },
        success:function(key){
            location.href='/checkout/details/'+key;
        },
    });
});
/*
function adjustModalMaxHeightAndPosition(){
  $('.modal').each(function(){
    if($(this).hasClass('in') === false){
      $(this).show();
    }
    var contentHeight = $(window).height() - 60;
    var headerHeight = $(this).find('.modal-header').outerHeight() || 2;
    var footerHeight = $(this).find('.modal-footer').outerHeight() || 2;

    $(this).find('.modal-content').css({
      'max-height': function () {
        return contentHeight;
      }
    });

    $(this).find('.modal-body').css({
      'max-height': function () {
        return contentHeight - (headerHeight + footerHeight);
      }
    });

    $(this).find('.modal-dialog').addClass('modal-dialog-center').css({
      'margin-top': function () {
        return -($(this).outerHeight() / 2);
      },
      'margin-left': function () {
        return -($(this).outerWidth() / 2);
      }
    });
    if($(this).hasClass('in') === false){
      $(this).hide();
    }
  });
}
if ($(window).height() >= 320){
  $(window).resize(adjustModalMaxHeightAndPosition).trigger("resize");
}
*/
$('.submit-on-enter').keypress(function(e){
  if (e.which == 13) {
    $(this).closest('form').submit();
  }
});


function rcSpin( el ) {
    var target=$($(el).data('target'));
    var adjust=parseInt($(el).data('adjust'));
    var minVal=parseInt($(el).data('min'));
    var maxVal=parseInt($(el).data('max'));
    if(isNaN(adjust)) adjust = 1;
    if(isNaN(minVal)) minVal = 0;
    if(isNaN(maxVal)) maxVal = 999999999;
    
    var val = parseInt(target.val());
    if (isNaN(val)) val = 0;
    val += adjust;
    if(val<minVal) val=minVal;
    if(val>maxVal) val=maxVal;
    target.val(val);
}

jQuery.fn.rcSpinner = function() {
    this.each(function(index){
        $(this).on('click', function(){
            rcSpin(this);
        });
    } );
}

function clickOnEnter(enterId,clickId){
	$(enterId).keyup(function(event){
	    if(event.keyCode == 13){
	        $(clickId).click();
	    }
	});			
}

function initVariantOptions(selector,options,variants,cb) {
    $(selector+' .variant-options-value').on('click', function() {
        var option = $(this).data('option');
        var value = $(this).text();
        $(selector+' .variant-options-value').addClass('disabled');
        $(selector+' .variant-options-value[data-option='+option+']').removeClass('selected');
        $(this).addClass('selected');
        
        var compatibleValues = {};
        for(var i = 0; i < options.length; ++i) {
            if(options[i] == option) continue;
            compatibleValues[options[i]] = {};
        }

        Object.keys(variants).forEach(function(key) {
            var variant = variants[key];
            if(variant[option] != value) return;
            
            for(var i = 0; i < options.length; ++i) {
                var optionRef = options[i];
                if(optionRef == option) continue;
            
                if(!(variant[optionRef] in compatibleValues[optionRef]))
                    compatibleValues[optionRef][variant[optionRef]] = 0; 
                compatibleValues[optionRef][variant[optionRef]]++; 
            }
        })
        
        Object.keys(compatibleValues).forEach(function(optionRef) {
            $(selector+' .variant-options-value[data-option='+optionRef+']').each(function(ix){
                if($(this).text() in compatibleValues[optionRef]) $(this).removeClass('disabled');
                else $(this).removeClass('selected');
            });
        });
        
        var selection = {};
        
        var variantId = null;
        for(var i = 0; i < options.length; ++i) {
            var selected = $(selector+' .variant-options-value[data-option='+options[i]+'].selected');
            if (selected.length==1)
                selection[options[i]] = selected.first().text();
        }

        var newVarId = null;
        var newVariant = null;
        if(Object.keys(selection).length == options.length) {
            Object.keys(variants).forEach(function(variantId) {
                var variant = variants[variantId];
                var matchedAll = true;
                Object.keys(selection).forEach(function(option) {
                    if(selection[option] != variant[option]) {
                        matchedAll = false;
                    }
                });
                if(matchedAll) {
                    newVarId = variantId;
                    newVariant = variant;
                }
            });
        }
        
        cb(newVarId, newVariant);
    });
}

function insertParam(key, value) {
    key = encodeURI(key); 
    value = encodeURI(value);
    var kvp = document.location.search.substr(1).split('&');
    
    if (kvp == '') {
        document.location.search = '?' + key + '=' + value;
    } else { 
        var i=kvp.length; 
        var x; 
        while(i--) {
            x = kvp[i].split('=');
    
            if (x[0]==key){
                x[1] = value;
                kvp[i] = x.join('=');
                break;
            }
        }
    
        if(i<0) 
            kvp[kvp.length] = [key,value].join('=');

        document.location.search = kvp.join('&'); 
    }
}

function addToWishList(productId, variantId){
    if(variantId == undefined)
        variantId = null;
    RC.Server.Wishlist.Item.add('default', { productId: productId, quantity: 1, variantId:$('#variant_id').val() },
    {
        failure:function(context,msg,xml,jqXHR) {
			bootbox.dialog({ 
			        message:'<h4 class="cart-title" style="margin-bottom:10px; color:red;"><strong>Your product was not added to wishlist!</strong></h4><hr>' + msg,
			        buttons:{
			            main:{
			                label: "Close",
			                 className: "btn btn-default"
			            }
			        }
			    });
	    },
        success: function (context, html, xml) {
            location.href = '/wishlist/default';
        }
    });   
}

function serversideFailure(context, msg, xml, jqXHR, form, title) {
    serversideFilure(context, msg, xml, jqXHR, form, title);
}

function serversideFilure(context, msg, xml, jqXHR, form, title) {
    var mainMsg=null;
    var hasFields=0;

    if ( xml ) {
     mainMsg = $(xml).find('data result msg').text();
     
     var validator = form.validate();
     var objErrMsg = {};
     var firstEl = '';
        
     $(xml).find('fields').children().each(function(){
         hasFields++;
 
         var code = $(this).find('code').text();
         if(firstEl == '') firstEl = code;
         var internalMsg = $(this).find('msg').text();
         
         objErrMsg[code] = internalMsg;
     });
     validator.showErrors(objErrMsg);
    }
    
    if(firstEl != '')
        $('#' + firstEl).focus();
    
    if(mainMsg && !hasFields)
        msg = mainMsg;


	$("div.submit-failed").show();
	$('button[type="submit"]').prop('disabled', false);
	$("div.submit-failed").html(msg);
            
     if(!hasFields)
     {
        bootbox.dialog({ 
        message:'<h4 class="cart-title" style="margin-bottom:10px; color:red;"><strong>' + title + '</strong></h4><hr><p>' + msg + '</p>',
        buttons:{
            main:{
                label: "Close",
                  className: "btn btn-default"
                }
            }
        });
    }
}

function MapStockIndicator(stock) {
    var stockText = '';
    
    if(stock == 'in-stock') {
        stockText = '<span style="color: green; font-weight:bold;">In Stock</span>';
        $('#product-stock-check').val('ok');
    }
    else if(stock == 'low-stock') {
        stockText = '<span style="color: green; font-weight:bold;">Low stock</span>';
        $('#product-stock-check').val('ok');
    }
    else if(stock == 'discontinued') {
        stockText = '<span style="color: red; font-weight:bold;">Discontinued</span>';
        $('#product-stock-check').val('not-allowed');
    }
    else if(stock == 'coming-soon') {
        stockText = '<span style="color: red; font-weight:bold;">Out of stock</span>';
        $('#product-stock-check').val('not-allowed');
    }
    else if(stock == 'out-of-stock') {
        stockText = '<span style="color: red; font-weight:bold;">Out of stock</span>';
        $('#product-stock-check').val('not-allowed');
    }
    else if(stock == 'awaiting-stock') {
        stockText = '<span style="color: red; font-weight:bold;">Out of stock</span>';
        $('#product-stock-check').val('not-allowed');
    }
    
    else if(stock == 'variants')
        stockText = '<span style="color:#aaaaaa;">(select variant to see availability)</span>';
    else if(stock == 'unknown')
        stockText = '<a data-toggle="modal" href="#product-enquiry-popup"> Check Now</a>';
    else if(stock == 'none')
        stockText = '-';
        
    if(stockText == '-')
        $('#stock-div').hide();
    else
        $('#stock-div').show();
        
    $('#stock-indicator').html(stockText);
    $('#product-stock').val(stock);
}

$(document).on('click', '.btn-add-cart', function() {
    if($(this).data('add-effect') != null)
        $(this).closest("div").effect("transfer",{ to: $(".basket") }, 3000);
});

$(document).on('click', '.btn-add-to-cart-with-variant', function() {
    var el = $(this);
    var productId = el.data('productid');
    var variantId = el.data('variantid');
    var currentUnits = el.data('availability');
    
    var variantSelector = (variantId == undefined || variantId == '') ? '' : '-' + variantId;
    var qty = $('#option-product-qty' + variantSelector).val();
    if(qty == undefined) qty = $('#option-product-qty').val();
    if(qty == undefined) qty = 1;
    
    if(variantId == 'waiting') {
        bootbox.alert('<h4><strong>Select Product Options</strong></h4><hr><p>You need to select product option(s) before adding this product to your shopping cart.</p><hr>');
        return false;
    }
    if($('#product-stock-check').val() == 'not-allowed') { 
        bootbox.alert('<h4><strong>Selected Product is discontinued</strong></h4><hr><p>Selected item is not available.</p>'); 
        return false; 
    }
    
    if(checkAvailableUnits(currentUnits, variantId, qty)) {
        RC.Server.Cart.add({productId: productId, quantity: qty, variantId: variantId}, {
            success:function(){
                $('#cart-top-header').reload();
                el.closest("div").effect("transfer",{ to: $(".basket") }, 3000);
            }
        });
    }
});

function checkAvailableUnits(currentUnits, variantId, qty) {
    var currentUnitsInt = parseInt(currentUnits);
    
    if(qty > currentUnitsInt) {
        var message = 'We only have ' + currentUnitsInt + ' left in stock.';
        if(currentUnitsInt == 0)
            message = 'This product is currently out of stock.';
        bootbox.alert('<h4 style="color: red"><strong>NOT ENOUGH STOCK</strong></h4><hr><p>' + message + '</p>');
        return false;
    }
    return true;
}

$(document).on('click', '.btn-add-cart-trigger', function() {
    $('.btn-add-cart-cancel:visible').click();
    $(this).closest('table').find('tr').hide();
    $(this).closest('tr').show();
    $(this).parent().parent().parent().find('.btn-add-cart-trigger, .btn-add-cart-trigger-user, .btn-add-cart-trigger-iccid').hide();
    $(this).hide();
    $(this).parent().find('.row-tel').show();
    $(this).parent().find('.row-user').hide();
    $(this).parent().find('.row-iccid').hide();
    $(this).parent().find('input').focus();
});

$(document).on('click', '.btn-add-cart-trigger-user', function() {
    $('.btn-add-cart-cancel:visible').click();
    $(this).closest('table').find('tr').hide();
    $(this).closest('tr').show();
    $(this).parent().parent().parent().find('.btn-add-cart-trigger, .btn-add-cart-trigger-user, .btn-add-cart-trigger-iccid').hide();
    $(this).hide();
    $(this).parent().find('.row-user').show();
    $(this).parent().find('.row-tel').hide();
    $(this).parent().find('.row-iccid').hide();
    $(this).parent().find('input').focus();
    
    $('button[role=starterpack]').data('isbuynow', $(this).data('isbuynow'));
});

$(document).on('click', '.btn-add-cart-trigger-iccid', function() {
    $('.btn-add-cart-cancel:visible').click();
    $(this).closest('table').find('tr').hide();
    $(this).closest('tr').show();
    $(this).parent().parent().parent().find('.btn-add-cart-trigger, .btn-add-cart-trigger-user, .btn-add-cart-trigger-iccid').hide();
    $(this).hide();
    $(this).parent().find('.row-iccid').show();
    $(this).parent().find('.row-tel').hide();
    $(this).parent().find('.row-user').hide();
    $(this).parent().find('input').focus();
});

$(document).on('click', '.btn-add-cart-cancel', function() {
    $(this).parent().parent().hide();
    $(this).parent().parent().parent().find('.btn-add-cart-trigger, .btn-add-cart-trigger-user, .btn-add-cart-trigger-iccid').show();
    $(this).closest('table').find('tr').show();
});

$(document).on('click', '.btn-add-cart-collection', function() {
    var stock = $(this).data('stock');
    var productid = $(this).data('productid');
    var madeoutto = $(this).parent().parent().find('.msisdn').val();
    var cancelButton = $(this).parent().find('.btn-add-cart-cancel');
    
    if(stock == 'discontinued') { 
        bootbox.alert('<h4><strong>Selected Product is discontinued</strong></h4><hr><p>Selected item is not available.</p>'); 
        return false; 
    }
    
    RC.Server.Cart.add({ productId: productid, quantity:1 }, {
        // post: 'metafields=msisdn&msisdn=' + msisdn,
        // success:function() {
        //     $('#cart-top-header').reload();
        //     $('#cart-updated-modal .modal-body').load('/cart/updated', function () {
        //        $('#cart-updated-modal').modal({ show: true });
        //     });
        //     cancelButton.click();
        // }
    });
});

function uploadDocuments(orderId, input) {
    //6. Upload Images ---------------------------------------------------------------------
    console.log('*** created order: ' + orderId + ', uploading images now: ' + $('#fileuploader').size() );

    var wrapper = $(input).parent().parent();
    var button = wrapper.find('button');
    button.hide();
    wrapper.find('.upload-status').html('<i class="fa fa-circle-o-notch fa-spin"></i>');
    
    var req = [];
    if (input.files && input.files.length) {
        for (var i = 0; i < input.files.length; i++) {
            var file = input.files[i];
            var defer = $.Deferred();
            var promise = RC.Server.SalesOrder.Documents.add(orderId, file, {
                failure: function(id, file, xhr, data) {
                    alert('failure');
                },
                success: function(id, file, xhr, data) {
                    defer.resolve();
                    
                    wrapper.find('.file-info').show(100);
                    wrapper.find('.upload-name').html(file.name);
                    
                    wrapper.find('.upload-status').html('<i class="fa fa-check"></i>');
                },
            });
            req.push(defer.promise());
        }
    }
}

$(document).on('click', 'button[role="recharge"]', function() {
    $(this).parent().parent().find('.error').hide();
    $(this).parent().parent().find('.msisdn').removeClass('errorField');
    
    var cancelButton = $(this).parent().find('.btn-add-cart-cancel');
   
    var reg = /^0\d{9}$/;
    var msisdn = $(this).parent().parent().find('.msisdn').val();
    if(!(msisdn.length == 10 && reg.test(msisdn))) {
        $(this).parent().parent().find('.error').show();
        $(this).parent().parent().find('.msisdn').addClass('errorField');
        return false;
    } 
   
    var productId = $(this).data('product-id');
    var variantid = $(this).data('variant-id');
    var has360ext = $(this).data('next360');
    // var postRequest = 'metafields=msisdn&msisdn=';
    // if(has360ext == '1') {
    //     var postRequest = 'metafields=ext_next360_msisdn&ext_next360_msisdn=';
    // }
    
    RC.Server.Cart.add({ productId: productId, quantity:1, variantId:variantid }, {
        // post: postRequest + $(this).parent().parent().find('.msisdn').val(),
        // success:function() {
        //     $('#cart-top-header').reload();
        //     $('#cart-updated-modal .modal-body').load('/cart/updated', function () {
        //        $('#cart-updated-modal').modal({ show: true });
        //     });
        //     cancelButton.click();
        // }
    });
});

$(document).on('click', 'button[role="recharge_subscribe"]', function() {
    $(this).parent().parent().find('.error').hide();
    $(this).parent().parent().find('.msisdn').removeClass('errorField');
    
    var cancelButton = $(this).parent().find('.btn-add-cart-cancel');
   
    var reg = /^0\d{9}$/;
    var msisdn = $(this).parent().parent().find('.msisdn').val();
    if(!(msisdn.length == 10 && reg.test(msisdn))) {
        $(this).parent().parent().find('.error').show();
        $(this).parent().parent().find('.msisdn').addClass('errorField');
        return false;
    } 
   
    var productId = $(this).data('product-id');
    var variantid = $(this).data('variant-id');
    var msisdn = $(this).parent().parent().find('.msisdn').val();
    var has360ext = $(this).data('next360');
    // var postRequest = 'metafields=ext_sales_subscription_subscribe,msisdn&ext_sales_subscription_subscribe=1&msisdn=' + msisdn;
    // if(has360ext == '1') {
    //     var postRequest = 'metafields=ext_sales_subscription_subscribe,ext_next360_msisdn&ext_sales_subscription_subscribe=1&ext_next360_msisdn=' + msisdn;
    // }
    
    RC.Server.Wishlist.clear('subscription', {}, {
        success:function() {
            
            RC.Server.Wishlist.Item.add('subscription', { productId: productId, variantId: variantid, quantity: 1 }, {
                // post: postRequest,
                // success:function() {
                    
                //     RC.Server.Wishlist.checkout('subscription', { }, { 
                //         success: function(key) { 
                //             location.href='/checkout/details/' + key; 
                //         }, 
                //         failure: function(context,errorMsg,xml,XHR) { 
                //             showErrorMessage('Checkout Failed', errorMsg);
                //         }
                //     });
                    
                // }
            });
        }, 
        failure: function(context,errorMsgClear,xml,XHR) { 
            showErrorMessage('Wishlist Clear Failed', errorMsgClear);
        }
    });
});

function addToCartAndCheckout(productId, variantId, packuser) {
    RC.Server.Cart.clear({}, {
        failure:function(context,msg,xml,jqXHR) {
            if(msg == 'Cart not found!') {
                addToCartAndCheckoutLogic(productId, variantId, packuser);
            }
            else {
                showErrorMessage('Clear cart failed', msg);
            }
        },
        success:function() {
            addToCartAndCheckoutLogic(productId, variantId, packuser);
        }
    });
}

function addToCartAndCheckoutLogic(productId, variantId, packuser) {
    RC.Server.Cart.add({ productId: productId, quantity:1, variantId:variantId }, {
        // post: 'metafields=pack_user&pack_user=' + packuser,
        // success:function() {
        //     RC.Server.Cart.checkout({}, { 
        //         success: function(key) { 
        //             location.href='/checkout/details/'+key; 
        //         }
        //     });
        // }
    });
}

$(document).on('click', 'button[role="starterpack"]', function() {
    $(this).parent().parent().find('.error').hide();
    $(this).parent().parent().find('.packuser').removeClass('errorField');
    
    var cancelButton = $(this).parent().find('.btn-add-cart-cancel');
    
    var packuser = $(this).parent().parent().find('.packuser').val();
    if(packuser.length == 0) {
        $(this).parent().parent().find('.error').show();
        $(this).parent().parent().find('.msisdn').addClass('errorField');
        return false;
    } 
 
    var productId = $(this).data('product-id');
    var variantid = $(this).data('variant-id');
    var isbuynow = $(this).data('isbuynow');
    
    if(isbuynow == true) {
        addToCartAndCheckout(productId, variantid, packuser);
    }
    else {
        RC.Server.Cart.add({ productId: productId, quantity:1, variantId:variantid }, {
            // post: 'metafields=pack_user&pack_user=' + packuser,
            // success:function() {
            //     $('#cart-top-header').reload();
            //     $('#cart-updated-modal .modal-body').load('/cart/updated', function () {
            //        $('#cart-updated-modal').modal({ show: true });
            //     });
            //     cancelButton.click();
            // }
        });
    }
});

$(document).on('click', 'button[role="activatesim"]', function() {
    $(this).parent().parent().find('.error').hide();
    $(this).parent().parent().find('.sim_serial').removeClass('errorField');
    
    var cancelButton = $(this).parent().find('.btn-add-cart-cancel');
    
    var simnumber = $(this).parent().parent().find('.sim_serial').val();
    if(simnumber.length != 19 || $.isNumeric(simnumber) == false) {
        $(this).parent().parent().find('.error').show();
        $(this).parent().parent().find('.msisdn').addClass('errorField');
        return false;
    } 
 
    var productId = $(this).data('product-id');
    var variantid = $(this).data('variant-id');
    
    RC.Server.Cart.add({ productId: productId, quantity:1, variantId:variantid }, {
        // post: 'metafields=sim_serial&sim_serial=' + simnumber,
        // success:function() {
        //     $('#cart-top-header').reload();
        //     $('#cart-updated-modal .modal-body').load('/cart/updated', function () {
        //        $('#cart-updated-modal').modal({ show: true });
        //     });
        //     cancelButton.click();
        // }
    });
});

$(document).on('click', 'button[role="addcart"]', function() {
    var productId = $(this).data('product-id');
    var variantid = $(this).data('variant-id');
    
    RC.Server.Cart.add({ productId: productId, quantity:1, variantId:variantid }, {
        success:function() {
            $('#cart-top-header').reload();
            $('#cart-updated-modal .modal-body').load('/cart/updated', function () {
               $('#cart-updated-modal').modal({ show: true });
            });
        }
    });
});

function showErrorMessage(title, message) {
    bootbox.dialog({
        title: title,
        message: message,
        buttons:{
            main:{
                label: "Close",
                  className: "btn btn-default"
                }
            }
    });   
}