$(function(){
    
    
    $('#another-batch').click(function(){
        changeGoods();
    });
    
     //今日推荐
    changeGoods();
    function changeGoods(){
        $.post("home/goods/changeGoods",null,function (data) {
        var box = document.getElementById('today-guess-li');
            var gettpl = document.getElementById('Tblist').innerHTML;
            laytpl(gettpl).render(data, function(html){
                box.innerHTML = html;
                $('.gImg').lazyload({ effect: "fadeIn",failurelimit : 10,skip_invisible : false,threshold: 200,placeholder:'http://jingomall.cn/upload/sysconfigs/2017-06/59536b244cd6d.png'});
            });
        })
    }
    // 猜你喜欢
    guessGoods();
    function guessGoods(){
        $.post("home/goods/guessGoods",null,function (data) {
        var data=data.value;
        var box = document.getElementById('like-guess-li');
            var gettpl = document.getElementById('Tblist').innerHTML;
            laytpl(gettpl).render(data, function(html){
                box.innerHTML = html;
                $('.gImg').lazyload({ effect: "fadeIn",failurelimit : 10,skip_invisible : false,threshold: 200,placeholder:'http://jingomall.cn/upload/sysconfigs/2017-06/59536b244cd6d.png'});
            });
        })
    }
    
    //输入框特效
    $('.input-box .search-input').focus(function() {
        console.log(12432);
        $('.search-special-effects').addClass('on');
    });
    
    $('.input-box .search-input').blur(function() {
        $('.search-special-effects').removeClass('on');
    });
    
    //大屏轮播事件
    function BigCarousel() {
        var i = 0;
        var sliderImg = $('.sliderUl li');
        var size =sliderImg.size();
        var switchPage = '';
        for (var j = 0; j < size; j++) {
            switchPage += '<li></li>';
        }
    
    
        $('.pagenum').append(switchPage);
        $('.pagenum li').eq(0).addClass('active');
        sliderImg.eq(0).fadeIn();
        // 向右运动
        function mover() {
            i++
            if (i == size) {
    
                i = 0;
            };
            sliderImg.eq(i).stop().fadeIn(600).siblings().stop().fadeOut(600);
            $('.pagenum li').eq(i).stop().addClass('active').siblings().stop().removeClass('active');
        }
    
        // 向左运动
        function movel() {
            i--;
            if (i == -1) i = size - 1;
            sliderImg.eq(i).stop().fadeIn(600).siblings().stop().fadeOut(600);
            $('.pagenum li').eq(i).stop().addClass('active').siblings().stop().removeClass('active');
            console.log(i);
        }
        //分页器事件
        $('.pagenum li').hover(function() {
            var index = $(this).index();
            sliderImg.eq(index).stop().fadeIn(1000).siblings().stop().fadeOut(1000);
            $(this).stop().addClass('active').siblings().stop().removeClass('active');
            i = $(this).index();
        });
        /*自动轮播*/
        var t = setInterval(function() { mover() }, 2000);
    
        //鼠标移入轮播图时间
        $('.content-slide-box').hover(function() {
            clearInterval(t);
        }, function() {
            /*自动轮播*/
            t = setInterval(function() { mover() }, 2000);
        });
        // 点击左箭头时间
        $('.content-slide-box .prev').click(function(event) {
            /* Act on the event */
            movel();
        });
        // 点击右箭头时间
        $('.content-slide-box .next').click(function(event) {
            /* Act on the event */
            mover();
            
        });
    
    }
    
    //轮播图获取
    function carousel(){
        $.post("home/index/carousel",null,function(data){
            console.log(data);
            var box = document.getElementById('sliderUl');
            var gettpl = document.getElementById('carousel').innerHTML;
            laytpl(gettpl).render(data, function(html){
                box.innerHTML = html;
                $('.gImg').lazyload({ effect: "fadeIn",failurelimit : 10,skip_invisible : false,threshold: 200,placeholder:'http://jingomall.cn/upload/sysconfigs/2017-06/59536b244cd6d.png'});
                BigCarousel();
            });
        })
    }
     carousel();
    })