import { useEffect, useMemo } from "react";
import { styled, createGlobalStyle, css } from "styled-components"

function App() {

  /**
   * 保存所有的 key 和对应的频率
   */
  const keys: Record<string, { frequency: number }> = {
    A: {
      frequency: 196
    },
    S: {
      frequency: 220
    },
    D: {
      frequency: 246
    },
    F: {
      frequency: 261
    },
    G: {
      frequency: 293
    },
    H: {
      frequency: 329
    },
    J: {
      frequency: 349
    },
    K: {
      frequency: 392
    }
  }

  // 用 createGlobalStyle 写全局样式
  const GlobalStyles = createGlobalStyle`
    body {
      background: #000;
    }
    .pressed {
      background: #aaa;
    }
  `;


  // 用 styled.xxx 写样式组件
  const KeysStyle = styled.div`
    width: 800px;
    height: 400px;
    margin: 40px auto;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    overflow: hidden;
  `
  // 用 css 创建复用的 css 片段
  const textStyle = css`
    line-height: 500px;
    text-align: center;
    font-size: 50px;
  `

  const KeyStyle = styled.div`
    border: 4px solid black;
    background: #fff;
    flex: 1;
    ${textStyle}

    &:hover {
      background: #aaa;
    }
  `

  // 创建 AudioContext，这个不需要每次渲染都创建，所以用 useMemo 包裹
  const context = useMemo(() => {
    return new AudioContext();
  }, []);

  const play = (key: string) => {
    const frequency = keys[key]?.frequency;
    if (!frequency) {
      return;
    }

    // 创建 oscillator 节点、gain 节点、destination 节点，连接起来，并播放
    const osc = context.createOscillator();
    osc.type = 'sine';

    // 按照某种规律修改音量
    const gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);

    // 用 GainNode 修改音量的方式都是直接改 value。
    osc.frequency.value = frequency;
    // 在 currentTime 当前时间设置音量为 0
    gain.gain.setValueAtTime(0, context.currentTime);
    // 0.01 秒后设置为 1，也就是声音是逐渐变大的（linear 是线性）
    // gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);
    gain.gain.linearRampToValueAtTime(1, context.currentTime + 0.01);

    osc.start(context.currentTime);

    // 在 1 秒后设置音量为 0.01，也就是声音指数级的变小。（exponential 是指数级）
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1);
    // start 到 stop 间隔 1 秒，就是按照上面的规律变化的音量
    osc.stop(context.currentTime + 1);

    document.getElementById(`key-${key}`)?.classList.add('pressed');
    setTimeout(() => {
      document.getElementById(`key-${key}`)?.classList.remove('pressed');
    }, 100)
  }
  /**
   * 简谱数字和键的对应关系
   */
  const map: Record<number, string> = {
    1: 'A',
    2: 'S',
    3: 'D',
    4: 'F',
    5: 'G',
    6: 'H',
    7: 'J',
    8: 'K'
  }
  function playMusic(music: number[][]) {
    let startTime = 0;
    music.forEach((item) => {
      setTimeout(() => {
        play(map[item[0]]);
      }, startTime * 0.5);
      startTime += item[1]
    })
  }

  function playSong1() {
    const music = [
      [6, 1000],
      [5, 1000],
      [3, 1000],
      [5, 1000],
      [8, 1000],
      [6, 500],
      [5, 500],
      [6, 1000]
    ];

    playMusic(music)
  }
  function playSong2() {
    const music = [
      [6, 1000],
      [6, 1000],
      [6, 1000],
      [3, 500],
      [6, 500],
      [5, 1000],
      [3, 500],
      [2, 500],
      [3, 1000]
    ];

    playMusic(music)
  }
  function playQiFengLe() {
    const music = [
      [2, 500],
      [1, 500],
      [2, 500],
      [1, 500],
      [2, 500],
      [3, 500],
      [5, 500],
      [3, 500],
      [2, 500],
      [1, 500],
      [2, 500],
      [1, 500],
      [2, 250],
      [3, 250],
      [2, 250],
      [1, 250],
    ];

    playMusic(music);
  }
  function playAnHao() {
    const music = [
      [1, 500],
      [2, 500],
      [3, 500],
      [5, 500],
      [6, 500],
      [5, 250],
      [5, 250],
      [6, 500],
      [5, 250],
      [5, 250],

      [6, 250],
      [7, 250],
      [6, 250],
      [5, 250],
      [6, 500],
      [5, 250],
      [5, 250],

      [6, 500],
      [5, 250],
      [5, 250],
      [6, 500],
      [5, 250],
      [5, 250],
      
      [6, 250],
      [5, 250],
      [5, 250],
      [5, 250],

      [6, 500],
      [5, 250],
      [5, 250],
      [6, 500],
      [5, 250],
      [5, 250],

      [6, 250],
      [7, 250],
      [6, 250],
      [5, 250],

      [6, 500],
      [5, 250],
      [5, 250],
      [6, 500],
      [5, 250],
      [5, 250],

      [5, 500],
      [0, 500],
      [1, 500],
      [3, 500],
      [5, 500],
      [5, 500],
      [3, 250],
      [5, 250],
      [5, 500],
      [3, 250],
      [5, 250],
      
      [5, 250],
      [3, 250],
      [3, 500],
      [1, 500],
      [1, 750],
      [1, 500],
      [3, 500],
      [5, 500],
    ];

    playMusic(music);
  }
  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      play(e.key.toUpperCase());
    })
  }, []);
  return <div>
    <KeysStyle as='section'>
      {
        Object.keys(keys).map((item: any) => {
          return <KeyStyle as='div' key={item}>
            <div onClick={() => play(item)} id={`key-${item}`}>
              <span>{item}</span>
            </div>
          </KeyStyle>
        })
      }
      <GlobalStyles />
    </KeysStyle>
    <div className='songs'>
      <button onClick={() => playSong1()}>世上只有妈妈好</button>
      <button onClick={() => playSong2()}>奢香夫人</button>
      <button onClick={() => playQiFengLe()}>起风了</button>
      <button onClick={() => playAnHao()}>暗号</button>
    </div>
  </div>
}

export default App
