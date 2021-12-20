import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 800px;
`;

export const BarChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  margin-right: 50px;
`;

export  const Text = styled.span`
  font-size: 25px;
  text-align: center;
`

export const Bar = styled.div`
  height: ${(props) => props.height}%;
  background-color: grey;
  margin: 10px 0;
   width: 150px;
`;
export const Message = styled.span`
  font-size: 50px;
  text-align: center;
`

