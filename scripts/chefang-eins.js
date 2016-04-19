$(document).ready(function() {
	// reset screen height.
	resetScreenHeight('cheFangLogin');
	
	// send captcha.
	$("#sendCaptcha").on("click", function() {
		var phone_number = $("#inputTele").val();
		var $that = $(this);
		var _count = 59;
		
		if ( !base.utils.checkMobile(phone_number) ) {
			hint('#inputTele', '请输入正确的手机号码');
		}else {
			base.common.postData( base.address.send_sms_4login, "mobile=" + phone_number, false, function(returnData) {
				if(returnData.responseCode == "100000") {
					if (returnData.data.responseCode == "100000") {
						questionCenter('.popup-blue', '.fit-icon', '验证码发送成功');
						$that.hide();
						$that.siblings('.waiting').show();
						var countingDown = setInterval(function() {
							if ( _count == 1 ) {
								window.clearInterval(countingDown);
								$that.siblings('.waiting').hide().val('59秒后可重发');
								$that.show();
								return false;
							}
							_count--;
							$that.siblings('.waiting').val( _count + '秒后重试' );
						}, 1000);
					} else {
						questionCenter('.popup-gray', '.error-icon', returnData.data.responseMessage);
					}
				}
			}, function(){} );
		}
	});
	
	// get card.
	$("#getKarten").on("click", function() {
		var phone_number = $("#inputTele").val();
		var phone_captcha = $("#inputCaptcha").val();
		
		if ( !base.utils.checkMobile(phone_number) ) {
			hint('#inputTele', '请输入正确的手机号码');
			return false;
		}

		base.common.postData(base.address.chefang_eins, "mobile=" + phone_number + "&captcha=" + phone_captcha, false, function(returnData) {
			if ( returnData.responseCode == 100000 ) {
				var _randomCombo = returnData.data.couponName;
				
				if ( _randomCombo.match(1000) ) {
					$('#cardPrice1, #cardPrice2').html('1000元');
					$('#comboName').html('内饰清洁杀菌+漆面深度养护套餐代金券');
				} else if ( _randomCombo.match(1500) ) {
					$('#cardPrice1, #cardPrice2').html('1500元');
					$('#comboName').html('内饰清洁杀菌+漆面深度养护+发动机舱清洁护理套餐代金券');
				} else {
					$('#cardPrice1, #cardPrice2').html('500元');
					$('#comboName').html('内饰清洁杀菌套餐代金券');
				}
				
				$('#kartenNummer').html( returnData.data.couponNo );
				$('#cheFangLogin').hide();
				$('#cheFangResult').show();
				$(window).scrollTop(0);
			} else {
				questionCenter('.popup-gray', '.error-icon', returnData.responseMessage);
			}
			
		}, function() {});
	});
});	
// reset screen height.
function resetScreenHeight(vaterId) {
	var window_height = window.screen.availHeight;
	var _cheFangLogin = document.getElementById(vaterId);
	
	_cheFangLogin.style.height = window_height + 'px';
}
// public question hint box.
function questionCenter(hintParentBox, hintBox, hint) {
	$('.question-center ' + hintBox).html(hint);
	$('.question-center ' + hintParentBox).show();
	setTimeout(function() {
		$('.question-center ' + hintParentBox).animate({opacity: 0}, 1500, function() {
			$('.question-center ' + hintBox).html('');
			$('.question-center ' + hintParentBox).hide().css('opacity', 1);
		});
	}, 1500);
}
// red input hint.
function hint(vater, text) {
	$(vater).css({'color': 'red'}).val(text);
	setTimeout(function() {
		$(vater).css({
			'color': '#222'
		}).val('');
	}, 1000);
}
