import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useExchangeDataList } from '../../../../hooks/use-exchangeData-list';
import { earthRadiusAtom } from '../../../../state/EarthRadius';
import { goalAtom } from '../../../../state/Goal';
import { latlng2Cartesian } from '../../../../util/coordinates';
import Box from '../Box/Box';
import Earth from '../Earth/Earth';
import Flow from '../Flow/Flow';

const NetworkPlanet = () => {
  const radius = useRecoilValue(earthRadiusAtom);
  const goal = useRecoilValue(goalAtom)

  const [ flowPacketList, setFlowPacketList ] = React.useState([] as JSX.Element[]);
  const packetCount  = React.useRef(0);
  const exchangeDataList = useExchangeDataList();

  useEffect(() => {
    // console.log(flowPacketList.length);
    setFlowPacketList((items) => {
      exchangeDataList.map((data, index) => {
        const thisCount = packetCount.current;
          items.push(
            <Flow 
              primary={thisCount}
              start={data.from} 
              goal={goal} 
              radius={radius}
              height={2}
              duration={2}
              onEnd={() => {
                setFlowPacketList((items) => {
                  delete items[thisCount];
                  return items;
                })
              }}
            />
          )
        packetCount.current += 1;
      })
      return items;
    })
  }, [exchangeDataList]);

  return (
    <>
      <Earth ele={{position: [0, 0, 0]}} radius={radius} />
      {/* <Flow 
        primary={0}
        start={{lat: -30, lng: 140}} 
        goal={goal} 
        radius={radius} 
        height={2}
        duration={10}
        onEnd={() => {
          setFlowPacketList((items) => {
            delete items[0];
            return items;
          })
        }}
      /> */}
      {flowPacketList.map((ele) => {
        if (ele) {
          return (
            <React.Fragment key={ele.props.primary}>
              {ele}
            </React.Fragment>
          )
        }
      })}
      {/* <Box position={latlng2Cartesian(radius, goal.lat, goal.lng)} /> */}
    </>
  );
}

export default NetworkPlanet;