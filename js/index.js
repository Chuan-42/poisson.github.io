/*（创建数组保存每条鱼的信息[[width,heiht,top,left],[,,,]]）
 	1、随机出鱼（大小和方向）	OK
 	2、随机出距顶部距离		OK
 	3、加载图片（显示0.5s切换）	OK
 	4、显示鱼的图片，同时开始移动	OK
 	5、移动过程判断是否与玩家相遇
 		1）判断两方大小，（死亡/胜利）
 		2）胜利隐藏被吃的鱼，自身长大
 		3）清除被吃鱼的属性
 	6、移动到边界处消失			OK
 	7、每隔时间段出现新鱼，		OK
*/
//积分，已吃
var integrale=0,nombre=0,vie=3;
//鱼的倍数最值
var minsize=0.3,maxsize=0.6;
//保存的随机鱼的原始大小
var fishbox=[[134,118,0,0],[185,118,0,0],[202,118,0,0],[176,116,0,0],[187,118,0,0],[128,118,0,0],[42,72,0,0]];
//x=[0,740]   y[0,438]
//用于保存玩家鱼的位置坐标(左上)
var x=0,y=0;
//用于保存上个位置
var x1,y1;
//保存游戏区域的大小
var widthMax=parseInt($(".left_bottom").css("width"));
var heightMax=parseInt($(".left_bottom").css("height"));
//隐藏鼠标
$(".left_bottom").mouseleave(function (){
	$(this).css("cursor","none");
})
function clone(){
	$(".ontologie").removeClass("bos");
}
//	按下
//按键
var tbkey=0,lrkey=0;
$("body").keydown(function (){
	var keys=event.keyCode;
	if(keys==37||keys==39){
		lrkey=keys;
	}
	if(keys==38||keys==40){
		tbkey=keys;
	}
	if(tbkey==38&&y>=0){
		y-=10;
	}else if(tbkey==40&&y<parseInt($(".left_bottom").css("height"))-parseInt($(".ontologie").css("height"))){
		y+=10;
	}
	if(lrkey==37&&x>0){
		x-=10;
	}else if(lrkey==39&&x<parseInt($(".left_bottom").css("width"))-parseInt($(".ontologie").css("width"))){
		x+=10;
	}
	deplacer();
})
$("body").keyup(function (){
	var keys=event.keyCode;
	if(keys==37||keys==39){
		lrkey=0;
	}else if(keys==38||keys==40){
		tbkey=0;
	}
})
//移动的方法
function deplacer(){
	//切换鱼转身的
	function switchFish(){
		$(".ontologie").removeClass("bos");
		if($(".ontologie img").attr("src")=="image/poissonimg/ontologie1.png"){
			$(".ontologie img").attr("src","image/poissonimg/ontologie2.png");
		}else{
			$(".ontologie img").attr("src","image/poissonimg/ontologie1.png");
		}
	}
	if(x1>x&&$(".ontologie img").attr("src")=="image/poissonimg/ontologie1.png"){
		$(".ontologie").addClass("bos");
		setTimeout(switchFish,200);
	}else if(x1<x&&$(".ontologie img").attr("src")=="image/poissonimg/ontologie2.png"){
		$(".ontologie").addClass("bos");
		setTimeout(switchFish,200);
	}

	x1=x;
	//判断不能出边界
	if(x>=0&&x<=parseInt($(".left_bottom").css("width"))-parseInt($(".ontologie").css("width"))){
		$(".ontologie").css("left",x);
	}
	if(y>=0&&y<=parseInt($(".left_bottom").css("height"))-parseInt($(".ontologie").css("height"))){
		$(".ontologie").css("top",y);
	}
}
//随机刷新出一条鱼
function RandomFish(){
	//判断小鱼数量是否已满
	if($(".fish img:hidden").length==0){
		return;
	}
	//获取装鱼的那个容器
	var fishs=$(".fish:hidden").eq(0);
	var zy=Math.ceil(Math.random()*100)%2;//0表示左，1表示右
	var Numfish=Math.ceil(Math.random()*100%7);//1-7表示不同的鱼
	//随机出鱼的这条鱼的大小
	var size=Math.ceil(Math.random()*10000)%200/100;
	while(true){
		if(size>minsize&&size<maxsize){
			break;
		}
		size=Math.ceil(Math.random()*10000)%200/100;
	}
	var topMax=heightMax-fishbox[Numfish-1][1]*size;//最大距离
	var topFish=Math.ceil(Math.random()*10000)%topMax;//随机出一个距顶部的高度
	var leftFish=0;//离左边的距离
	if(zy==1){
		leftFish=widthMax-fishbox[Numfish-1][0]*size;
	}
	//生成图片地址
	var str="image/ennemi/fish"
	if(zy==1){
		str+="s";
	}
	str+=Numfish+".png";
	//更改图片
	var fishyu=$(".fish img:hidden").eq(0);
	//改变容器属性
	fishs.css({
		"width": fishbox[Numfish-1][0]*size,
		"height":fishbox[Numfish-1][1]*size,
		"top":topFish+"px",
		"left":leftFish+"px"
	});
	//将获取到容器图片切换，并显示
	fishyu.attr("src","image/timg.gif");
	fishs.css("display","block");
	//随机出一个速度
	var vitesse=Math.ceil(Math.random()*100)%3+2;
	setTimeout(function (){
		fishyu.attr("src",str);
	},1000);
	//延时1s后开始运动
	setTimeout(function (){
		//移动，时间间隔0.05s
		var time=setInterval(function (){
		//更改图片
		var left=parseInt(fishs.css("left"));
		if(zy==0){
			left+=vitesse;
			if(left>=widthMax-fishbox[Numfish-1][0]*size){
				fishs.css("display","none");
				clearInterval(time);
			}
		}else{
			left-=vitesse;
			if(left<=0){
				fishs.css("display","none")
				clearInterval(time);
			}
		}
			fishs.css("left",left+"px");
			var fisho=$(".ontologie");
			//与玩家相遇时判断
			var widtho=parseFloat(fisho.css("width"));//宽
			var heighto=parseFloat(fisho.css("height"));//高
			var lefto=parseFloat(fisho.css("left"));//左边距离
			var topo=parseFloat(fisho.css("top"));//上边距离
			//获取当前游动的其他鱼
			var widths=parseInt(fishs.css("width"));
			var heights=parseInt(fishs.css("height"));
			var lefts=parseInt(fishs.css("left"));
			var tops=parseInt(fishs.css("top"));
			//判断两鱼是否相遇以其它鱼判断
			if(lefts>lefto&&lefts<lefto+widtho&&tops<topo+heighto&&tops>topo||lefto<lefts+widths&&lefto>lefts&&topo>tops&&topo<tops+heights||lefts<lefto+widtho&&lefts>lefto&&tops+heights>topo&&tops<topo||lefto<lefts+widths&&lefto>lefts&&topo+heighto>tops&&topo<tops){//左上
				//胜利
				if(widtho*heighto>widths*heights){
					widtho=widtho*1.01;
					heighto=heighto*1.01;
					fisho.css({
						"width":widtho+"px",
						"height":heighto+"px"
					});
					fishs.css("display","none");
					clearInterval(time);
					//刷新已吃数量
					nombre++;
					$("#nombre").html(nombre);
					//刷新积分
					integrale+=Numfish*2+1;
					$("#integrale").html(integrale);
					if(nombre>40){
						minsize=0.6,maxsize=1.2;
					}else if(nombre>20){
						minsize=0.4,maxsize=0.8;
					}
				}else{//失败，玩家死亡
					vie--;
					fishs.css("display","none");
					clearInterval(time);
					$("#vie").html(vie);
					if(vie==0){
						$(".mourir").show(1000);
						$(".ontologie").hide();
						$(".jf").text(integrale);
						$(".sl").text(nombre);
						//停止所有计时器
						$(".fish").css("display","none")
						var highestTimeoutId = setTimeout(";");
 						for (var i = 0 ; i < highestTimeoutId ; i++) {
   							clearTimeout(i); 
   						}
					}
				}
			}
	},50);
	},1000);
}
//与玩家相遇时判断
//function FishMeet(){
//	//获取玩家鱼
//	var fisho=$(".ontologie");
//	var widtho=parseInt(fisho.css("width"));//宽
//	var heighto=parseInt(fisho.css("height"));//高
//	var lefto=parseInt(fisho.css("left"));//左边距离
//	var topo=parseInt(fisho.css("top"));//上边距离
//	//获取当前游动的其他鱼的集合
//	var fishs=$(".fish:visible");
//	for(var i=0;i<fishs.length;i++){
//		var widths=parseInt(fishs.eq(i).css("width"));
//		var heights=parseInt(fishs.eq(i).css("height"));
//		var lefts=parseInt(fishs.eq(i).css("left"));
//		var tops=parseInt(fishs.eq(i).css("top"));
//		//判断两鱼是否相遇以其它鱼判断
//		if(lefts>lefto&&lefts<lefto+widtho&&tops<topo+heighto&&tops>topo){//左上
//			console.log("左上相遇");
//		}else if(lefto<lefts+widths&&lefto>lefts&&topo+heighto>tops&&topo<tops){//右上
//			console.log("右上相遇");
//		}else if(lefts<lefto+widtho&&lefts>lefto&&tops+heights>topo&&tops<topo){//左下相遇
//			console.log("左下相遇");
//		}else if(lefto<lefts+widths&&lefto>lefts&&topo>tops&&topo<tops+heights){//右下
//			console.log("右下相遇");
//		}
//	}
//}
//开始加载
var nrs=1;
var chargements=setInterval("chargement()",200);
function chargement(){
	nrs+=Math.ceil(Math.random()*100)%9;
	$(".texts").text(nrs+"%");
	if(nrs>=100){
		nrs=100;
		clearInterval(chargements);
		$(".coments").css("cursor","pointer")
		$(".texts").text("加载完成点击进入游戏");
	}
	$(".nr").css("width",nrs+"%")
}
//点击隐藏加载页面
$(".coments").click(function (){
	if(nrs==100){
			$(this).animate({"width":"820px"},1000);
		setTimeout(function (){
			$(".coments").animate({"opacity":"0"},1000);
			setTimeout(function (){
				$(".coments").css("display","none");
			},1000);
		},1000);
	}
})
$(".commencer").click(function (){
	$(".menu").animate({"height":"480px","top":"160px","opacity":"0"},1000);
	setTimeout(function (){
		setInterval("RandomFish()",4000);
		RandomFish();
		RandomFish();
		$(".menu").css("display","none");
	},1000);
})
//$(".menu p button").mouseover(function (){
//	var index=$(".menu p button").index($(this));
//	var btns=$(".menu p button").eq(index);
//	var yudong=setInterval(function (){
//		btns.css("width",parseInt(btns.css("width"))+10+"px")
//		if(parseInt(btns.css("width"))>400){
//			yudong.clearInterval();	
//		}
//	},10);
//})
//退出关闭
$(".quitter").click(function (){
	window.close();
})
//重新开始
$(".mourir p button:eq(0)").click(function (){
		$(".mourir").hide(1000);
		Init();
})
//返回主页面
$(".mourir p button:eq(1)").click(function (){
	$(".mourir").hide();
	$(".menu").css({
			"width": "820px",
			"height":"560px",
			"opacity":"1",
			"top":"60px"
		});
		$(".menu").show(1000);
})
//死亡后重新开始初始化
function Init(){
	//停止所有计时器
	$(".fish").css("display","none")
	var highestTimeoutId = setTimeout(";");
	for (var i = 0 ; i < highestTimeoutId ; i++) {
		clearTimeout(i); 
	}
	setInterval("RandomFish()",4000);
	RandomFish();
	RandomFish();
	$("#nombre").html("0");
	$("#integrale").html("0");
	integrale=0,nombre=0,vie=3;
	//鱼的倍数最值
	minsize=0.3,maxsize=0.6;
	x=0;
	y=0;
	$(".ontologie").show();
	deplacer();
}
$(".tc").click(function (){
	window.close();
})
$(".sx").click(function (){
	Init();
})
$(".zy").click(function (){
	$(".fish").css("display","none")
	var highestTimeoutId = setTimeout(";");
	for (var i = 0 ; i < highestTimeoutId ; i++) {
		clearTimeout(i); 
	}
	$(".mourir").hide();
	$(".menu").css({
			"width": "820px",
			"height":"560px",
			"opacity":"1",
			"top":"60px"
		});
		$(".menu").show(1000);
})
