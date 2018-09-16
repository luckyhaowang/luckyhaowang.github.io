/*当页面文档加载完成*/
//$(function () {});   当页面文档加载完成
//window.onload = function () {} 当所有资源加载完成
//1.不建议大家在移动web中使用jquery
//1.1 jquery特点：大量的代码去处理兼容IE678问题  代码多余，体积变大，加载不快
//1.2 使用原生JS是最快的，使用H5的api
//1.3 使用轻量的库 zepto.js 是一个精简版的jquery
//当页面文档加载完成
document.addEventListener('DOMContentLoaded', function () {
    /*轮播图*/
    /*1. 自动播放  无缝衔接  滑动衔接*/
    /*2. 点滚动*/
    /*3. 滑动功能*/
    /*4. 当滑动结束  如果滑动的距离较小  吸附回去 */
    /*5. 当滑动结束  如果滑动的距离较大  动画切换  (上一张|下一张)*/
    /*6. 当滑动结束  如果速度较快 动画切换  (上一张|下一张) */

    /*获取元素*/
    var banner = document.querySelector('.jd_banner');
    //没每切换一次就是一个宽度
    var width = banner.offsetWidth;
    //图片容器
    var imgBox = banner.querySelector('ul:first-child');
    //点容器
    var pointBox = banner.querySelector('ul:last-child');

    //常用方法
    var addTransition = function () {
        imgBox.style.webkitTransition = 'all 0.2s';
        imgBox.style.transition = 'all 0.2s';
    };
    var delTransition = function () {
        imgBox.style.webkitTransition = 'none';
        imgBox.style.transition = 'none';
    }
    var setTranslateX = function (translateX) {
        imgBox.style.webkitTransform = 'translateX(' + translateX + 'px)';
        imgBox.style.transform = 'translateX(' + translateX + 'px)';
    };

    var index = 1;
    var timer = null;
    var autoPlay = function () {
        timer = setInterval(function () {
            index++;
            //动画的切换
            addTransition();
            setTranslateX(-index * width);
        }, 4000);
    };
    autoPlay();
    imgBox.addEventListener('transitionend', function () {
        /*无缝衔接*/
        if (index >= 9) {
            index = 1;
            //不做动画的切换  瞬间切换
            delTransition();
            setTranslateX(-index * width);
        }
        /*滑动衔接*/
        else if (index <= 0) {
            index = 8;
            //不做动画的切换  瞬间切换
            delTransition();
            setTranslateX(-index * width);
        }
        //设置点
        setPoint();//当调用这个函数 现在的index取值范围是多少 1-8 之间
    });

    var setPoint = function () {
        /*index  1-8 */
        /*1. 去掉之前的选中*/
        pointBox.querySelector('li.now').classList.remove('now');
        /*2. 为对应的点选中*/
        pointBox.querySelector('li:nth-child(' + index + ')').classList.add('now');
    }

    var startX = 0;
    var changeX = 0;
    var startTime = 0;
    imgBox.addEventListener('touchstart', function (e) {
        clearInterval(timer);
        //获取起始位置的坐标
        startX = e.touches[0].clientX;
        startTime = Date.now(); //当前时间  时间戳
    });
    imgBox.addEventListener('touchmove', function (e) {
        var moveX = e.touches[0].clientX;
        changeX = moveX - startX;
        //已经计算好了 改变的距离
        //console.log(changeX);
        //将要移动的位置 = 原来的位置 + 改变的位置
        var translateX = -index * width + changeX;
        //实时定位
        delTransition();
        setTranslateX(translateX);
    });
    imgBox.addEventListener('touchend', function (e) {
        //距离
        var distance = Math.abs(changeX);  //单位PX
        var time = Date.now() - startTime; //单位MS
        //速度切换  v=s/t
        var v = distance / time;   //单位 px/ms
        if(v > 0.4){
            //切换
            //右滑动 上一张
            if(changeX > 0){
                index --;
            }
            //左滑动 下一张
            else {
                index ++;
            }
            addTransition();
            setTranslateX(-index*width);
        }else {
            if (distance < width / 3) {
                //吸附 以动画的形势切换回去
                addTransition();
                setTranslateX(-index*width);
            }else {
                //切换
                //右滑动 上一张
                if(changeX > 0){
                    index --;
                }
                //左滑动 下一张
                else {
                    index ++;
                }
                addTransition();
                setTranslateX(-index*width);
            }
        }
        autoPlay();
    });
});