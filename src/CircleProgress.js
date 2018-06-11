import React from 'react'
import './index.css'
import PropTypes from 'prop-types'
class CircleProgress extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			//浏览器内核是否是ie
			isIE:false,
			//ie状态下的计数器,
			ieCounter:0,
			totalTime:this.props.progressTime,
			progressTime:this.props.progressTime,
			isAnimationStart:false,
			deltaTime:this.props.timeMethod==='integer'?1:0.1,
			timerId:null,
			hideAfterDone:false,
			//svg中circle的strokeDasharray属性
			strokeDasharray:'',
			//圆环周长
			perimeter:Math.PI * 2 *(0.5-this.props.strokeWidth/100) * this.props.circleDiameter
		}
	}
	componentDidMount(){
		//初始化实线长度为圆周长，然后慢慢减少到0，形成过渡效果
		this.setState({
			strokeDasharray:this.state.perimeter+' 0',
			//判断是否是ie，如果是ie则动画效果改为分段
			isIE:navigator.userAgent.indexOf('Trident')!==-1
		});
		//启动倒计时
		if(this.props.isStart){
			this.props.onCountDownStart && this.props.onCountDownStart();
			this.runCountDown();
		}
	}
	componentWillReceiveProps(nextProps){
		//这里只要设置了isStart为true就启动倒计时
		if(nextProps.isStart){
			//必须先判断该方法是否存在
			this.props.onCountDownStart && this.props.onCountDownStart();
			this.runCountDown();
		}
	}
	runCountDown(){
		clearInterval(this.state.timerId);
		//这里是初始化倒计时，重新开始计时
		this.setState({
			progressTime:0,
			strokeDasharray:this.state.perimeter+' 0',
			totalTime:this.props.progressTime,
			ieCounter:0
		},()=>{
			//立即执行一次,这里的settimeout不可少
			//因为要上面设置了progressTime为0，这是控制transition时间的变量，让进度条瞬间重新复原
			setTimeout(()=>{
				this.update();
			},10);
			//控制倒计时显示
			let timerId = setInterval(()=>{
				//倒计时结束
				if(this.state.totalTime-this.state.deltaTime <=0){
					clearInterval(this.state.timerId);
					this.setState({
						totalTime:0,
						hideAfterDone:this.props.hideAfterDone,
						strokeDasharray:'0 '+this.state.perimeter
					});
					//调用回调函数
					this.props.onCountDownDone && this.props.onCountDownDone();
					return;
				}
				this.update();
				//注意这里的时间修改不能放在update中
				this.setState({
					totalTime:this.state.totalTime-this.state.deltaTime,
				})
			},1000*this.state.deltaTime);
			this.setState({
				timerId:timerId
			})
		});
	}
	//更新进度条长度
	update(){
		//判断ie,如果是ie则每次减少deltaTime所对应的周长，没有动画效果
		var strokeDasharray = '';
		if(this.state.isIE){
			var deltaCircleLength = this.state.perimeter / this.state.progressTime * this.state.deltaTime;
			strokeDasharray = this.state.perimeter-this.state.ieCounter*deltaCircleLength+' '+this.state.ieCounter*deltaCircleLength;
		}else{
			strokeDasharray = '0 '+this.state.perimeter
		}
		this.setState({
			ieCounter:this.state.ieCounter+1,
			progressTime:this.props.progressTime,
			strokeDasharray:strokeDasharray,
		});
	}

	render(){
		let {
				circleDiameter,
				strokeWidth,
				circleColor,
				backgroundCircleColor
			} = this.props;
		//wrapper尺寸
		let wrapperStyle = {
			width:circleDiameter+'px',
			height:circleDiameter+'px',
			//这里将整个wrapper沿着x轴翻转180度，是为了让进度条减少从右侧开始而不是左侧
			transform:'rotateX(180deg)'
		};
		//字体的style
		let fontStyle = Object.assign({},{
			lineHeight:circleDiameter+'px',
			//将里面的字体翻转回来摆正
			transform:'rotateX(-180deg)'
		},this.props.fontStyleObj);
		//如果2个圆环widerStrokeWidth相同，会产生毛边现象，因此给第二个circle宽度加1px覆盖毛边
		let widerStrokeWidth = circleDiameter*strokeWidth/100+'px';
		//圆心中点坐标
		let centerX = this.props.circleDiameter*0.5;
		//倒计时字体
		let countDownText = this.props.timeMethod === 'integer'?this.state.totalTime:this.state.totalTime.toFixed(1);
		return(
			<div className={`react-circle-progress-wrapper ${this.state.hideAfterDone?'hide-circle-progress':''}`} style={wrapperStyle}>
				<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" >
					<circle cx="50%" cy="50%"
							r={(50-strokeWidth)+'%'}
							strokeWidth={strokeWidth+'%'}
							stroke={backgroundCircleColor}
							id="progressCircleDown"
							fill="none">
					</circle>
					<circle cx="50%" cy="50%"
							r={(50-strokeWidth)+'%'}
							id="progressCircle"
							style={{transitionDuration:this.state.progressTime+'s'}}
							strokeWidth={widerStrokeWidth}
							stroke={circleColor}
							fill="none"
							transform={"rotate(90 "+centerX+" "+centerX+")"}
							strokeDasharray={this.state.strokeDasharray}
							>
					</circle>
				</svg>
				<div className="react-circle-count-down" style={fontStyle}>
					{countDownText}
				</div>
			</div>
		)
	}
}

CircleProgress.propTypes = {
	progressTime:PropTypes.number.isRequired,
	isStart:PropTypes.bool.isRequired,
	//圆环直径
	circleDiameter:PropTypes.number,
	//圆环颜色
	circleColor:PropTypes.string,
	//圆环背景色
	backgroundCircleColor:PropTypes.string,
	//圆环宽度
	strokeWidth:function(props, propName, componentName) {
		if(typeof props[propName]!=='number'){
			return new Error('Invalid strokeWidth,must be number '+props[propName])
		}
		if(props[propName]<0||props[propName]>100){
			return new Error('Invalid strokeWidth,must be 0 to 100 '+props[propName])
		}
	},
	timeMethod:PropTypes.oneOf(['integer','decimals']),
	hideAfterDone:PropTypes.bool,
	//完成时的回调函数
	onCountDownDone:PropTypes.func,
	//开始倒计时的回调
	onCountDownStart:PropTypes.func,
	//倒计时字体样式
	fontStyleObj:PropTypes.object,
};
CircleProgress.defaultProps = {
	progressTime:10,
	isStart:false,
	circleDiameter:50,
	circleColor:'#337fff',
	backgroundCircleColor:'#dddddd',
	strokeWidth:10,
	timeMethod:'integer',
	hideAfterDone:false
};
export default CircleProgress