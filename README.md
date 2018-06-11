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
| progressTime <font color=red >(Required)</font> | number | 10 | Total time to count down |
| barColor | string | '#337fff' | Progress bar color |
| hideAfterScroll | bool | false | if `true` the progress bar will hide after scroll |
| timeAfterScrollToHide | number | 1000 | Interval time(ms) for hideAfterScroll |

