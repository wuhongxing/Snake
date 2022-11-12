import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';

var width = 20
var height = 20

var wCount = 30
var hCount = 30
var speed = 10

const SnakeHead = ({x, y, direction}) => {
  const rotate = () => {
    switch (direction) {
      case 'right': return `rotate(0deg)`
      case 'down': return `rotate(90deg)`
      case 'left': return  `rotate(180deg)`
      case 'up': return `rotate(270deg)`
    }
    return `rotate(0deg)`
  }
  return <div style={{
    left: x * width,
    top: y * height,
    transform: rotate(direction),
    background: 'red', width, height, position: 'absolute', borderTopRightRadius: 8, borderBottomRightRadius: 8, borderTopLeftRadius: 4, borderBottomLeftRadius: 4}}>
    <div style={{position: 'absolute', left: width - 8, top: 4, width: 4, height: 4, background: 'black', borderRadius: 2}}></div>
    <div style={{position: 'absolute', left: width - 8, top: 12, width: 4, height: 4, background: 'black', borderRadius: 2}}></div>
  </div>
}

const SnakeBody = ({x, y}) => {
  return <div style={{
    left: x * width,
    top: y * height,
    width, height, background: 'cyan', position: 'absolute', borderRadius: 6}}></div>
}

const Snake = ({data, direction}) => {
  return <>
  { data.map($0 => {
    const {x, y, type} = $0
    const key = `${type}${x}${y}`
      if (type === 'head') return <SnakeHead key={key} x={x} y={y} direction={direction} />
      return <SnakeBody key={key} x={x} y={y} />
    })
  }
  </>
}

const Food = ({x, y}) => {
  if (x === undefined || y === undefined) return
  return <div style={{
    left: x * width,
    top: y * height,
    position: 'absolute', background: 'green', width, height}}></div>
}

const _snakeData = [
  {x: 3, y: 0, type: 'head'},
  {x: 2, y: 0, type: 'body'},
  {x: 1, y: 0, type: 'body'},
  {x: 0, y: 0, type: 'body'},
]

const SnakeArea = () => {
  const [food, setFood] = useState()
  const [score, setScore] = useState(0)
  const [snakeData, setSnakeData] = useState(_snakeData)
  const direction = useRef('right')
  const intervalRef = useRef()
  const [gameOver, setGameOver] = useState(false)

  const result = []
  for (let i = 0; i < wCount; i++) {
    for (let j = 0; j < hCount; j++) {
      result.push([i, j])
    }
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      switch (direction.current) {
        case 'left':
          onKeyPress({key: 'a'})
          break
        case 'right':
          onKeyPress({key: 'd'})
          break
        case 'up':
          onKeyPress({key: 'w'})
          break
        case 'down':
          onKeyPress({key: 's'})
          break
      }
    }, 1000 / speed);
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [food])

  useEffect(() => {
    window.addEventListener('keypress', onKeyPress)
    return () => window.removeEventListener('keypress', onKeyPress)
  }, [food?.x, food?.y])

  useEffect(() => {
    while (true) {
      let x = Math.floor(Math.random() * wCount)
      let y = Math.floor(Math.random() * hCount)
      const isExist = snakeData.some($0 => $0 .x === x && $0.y === y)
      if (!isExist) {
        setFood({x, y})
        break
      }
    }
  }, [score])

  const onKeyPress = (e) => {
    const oldHead = snakeData.filter($0 => $0.type === 'head')[0]
    const newHead = {...oldHead}
    switch (e.key) {
      case 'd':
      case 'D': {
        if (direction.current === 'left') return
        direction.current = 'right'
        newHead.x += 1
      }
        break

      case 'a':
      case 'A':
        if (direction.current === 'right') return
        direction.current = 'left'
        newHead.x -= 1
      break
      case 'w':
      case 'W':
        if (direction.current === 'down') return
        direction.current = 'up'
        newHead.y -= 1
      break
      case 's':
      case 'S': {
        if (direction === 'up') return
        direction.current = 'down'
        newHead.y += 1
      }
      break
      default: return
    }
    const bodys = snakeData.filter ($0 => $0.type === 'body')
    const overlap = bodys.some($0 => $0.x === newHead.x && $0.y === newHead.y)
    if (newHead.x >= wCount || newHead.y >= wCount || newHead.x < 0  || newHead.y < 0 || overlap) {
      clearInterval(intervalRef.current)
      setGameOver(true)
    }
    snakeData.unshift(newHead)
    oldHead.type = 'body'
    if (newHead.x !== food?.x || newHead.y !== food?.y) {
      snakeData.splice(-1, 1)
    } else {
      setScore(score + 1)
    }
    setSnakeData([...snakeData])
  }

  return <>
    <div style={{fontSize: 40}}>分数：{score}</div>
    {gameOver && <div style={{fontSize: 40}}>Game Over</div>}
    <div
    style={{position: 'relative', marginTop: 10, marginLeft: 10}}>
      {result.map(($0, $1) => <div key={$1} style={{
        background: '#abc890',
        width,
        height,
        position: 'absolute', left: $0[0] * width, top: $0[1] * height
      }}></div>)
      }
      <Snake data={snakeData} direction={direction.current} />
      <Food x={food?.x} y={food?.y} />

    </div>

  </>
}

const App = () => {
  return <SnakeArea />
}

export default App;
