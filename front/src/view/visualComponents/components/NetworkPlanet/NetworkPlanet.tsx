import React, { useEffect } from 'react';
import Box from '../Box/Box';
import Earth from '../Earth/Earth';
import Flow from '../Flow/Flow';

const NetworkPlanet = () => {
  const [ radius, setRadius] = React.useState(8);
  const [ goal, setGoal ] = React.useState({lat: 140, lng: 35});
  const [ item, setItem ] = React.useState([
    (<Flow 
      primary={0}
      start={{lat: 0, lng: 0}} 
      goal={goal} 
      radius={radius} 
      height={2}
      duration={1}
      onEnd={() => {
        setItem((items) => {
          delete items[0];
          return items;
        })
      }}
    />),
    (<Flow 
      primary={1}
      start={{lat: 90, lng: 0}} 
      goal={goal} 
      radius={radius} 
      height={2}
      duration={1}
      onEnd={() => {
        setItem((items) => {
          delete items[1];
          return items;
        })
      }}
    />)
  ]);
  const [ itemNum, setItemNum ] = React.useState(2);

  const theta = Math.PI * 0;
  const phi = Math.PI * 0;

  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(theta);

  useEffect(() => {
    
    setTimeout(() => {
      setItem((items) => {
        let num = itemNum;
        return items.concat((<Flow
          primary={num}
          start={{lat: 180, lng: 0}} 
          goal={goal} 
          radius={radius} 
          height={2}
          duration={1}
          onEnd={() => {
            setItem((items) => {
              delete items[num];
              return items;
            })
          }}
        />))
      })
      setItemNum(itemNum + 1);
      console.log(item)
    }, 3000);
  })

  return (
    <>
      <Earth ele={{position: [0, 0, 0]}} radius={radius} />
      {item.map((ele) => {
        if (ele) {
          return (
            <React.Fragment key={ele.props.primary}>
              {ele}
            </React.Fragment>
          )
        }
      })}
      <Box position={[x, y, z]} />
    </>
  );
}

export default NetworkPlanet;