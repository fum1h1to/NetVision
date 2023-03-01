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
    exchangeDataList.map((data, index) => {
      const thisCount = packetCount.current;
      setFlowPacketList((items) => {
        return items.concat(
          <Flow 
            primary={thisCount}
            start={data.from} 
            goal={goal} 
            radius={radius} 
            height={2}
            duration={1}
            onEnd={() => {
              setFlowPacketList((items) => {
                delete items[thisCount];
                return items;
              })
            }}
          />
        )
      })
      packetCount.current += 1;
    })
  }, [exchangeDataList]);

  return (
    <>
      <Earth ele={{position: [0, 0, 0]}} radius={radius} />
      {flowPacketList.map((ele) => {
        if (ele) {
          return (
            <React.Fragment key={ele.props.primary}>
              {ele}
            </React.Fragment>
          )
        }
      })}
      <Box position={latlng2Cartesian(radius, 35, 140)} />
    </>
  );
}

export default NetworkPlanet;