# react-circle-count-down
A react count-down plugin in circle shape! <br />
![img](https://github.com/houzisbw/react-circle-count-down/blob/master/img/1.jpg)
<br />
## Installation

##### NPM
```bash
npm install --save react-circle-count-down
```
##### Yarn
```bash
yarn add react-circle-count-down
```

## Usage
```js
import CountDown from 'react-circle-count-down'
<CountDown isStart={true} progressTime={10}/>
```
## Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| progressTime (required) | number | 10 | Total time to count down |
| isStart (required) | bool | none |A bool flag to start the count-down progress,set it to **true** to start the count-down, you can reset the count down by set it to **true** |
| circleDiameter | number | 50 | The circle's diameter, controls the size of the component |
| circleColor | string | '#337fff' | The color of circle,in the picture above is blue |
| strokeWidth | number | 10 (max:100) | The width of the circle |
| timeMethod | string | 'integer',one of ['integer','decimals'] | 'integer' means the text of countdown is integer, 'decimals' means the text is float number |
| hideAfterDone | bool | false | whether to hide the circle after count-down completed |
| onCountDownDone | function | none | The callback when the count-dwon is completed |
| onCountDownStart | function | none | The callback when the count-dwon is started |
| fontStyleObj | object | {} | The style object to customize the cound-down text |
