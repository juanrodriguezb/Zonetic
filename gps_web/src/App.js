import React, { Component} from 'react';
import {GoogleMap,Marker, LoadScript, Polyline} from "@react-google-maps/api";
import mapStyles from "./mapStyles";
import axios from 'axios';
import { Button } from 'rebass';
import DateTimePicker from 'react-datetime-picker';
import Switch from "react-switch";
import SlidingPanel from 'react-sliding-side-panel';
import DiscreteSlider from './Slide';
//import Select from 'react-select';
import dotenv from 'dotenv';
require('dotenv').config()

dotenv.config()
const API_KEY=process.env.REACT_APP_MAPS_API;
const API_URL_1=process.env.REACT_APP_API_URL_1;
const API_URL_2=process.env.REACT_APP_API_URL_2;
const API_URL_4=process.env.REACT_APP_API_URL_4;
const API_URL_6=process.env.REACT_APP_API_URL_6;
const API_URL_7=process.env.REACT_APP_API_URL_7;
const API_URL_8=process.env.REACT_APP_API_URL_8;
const API_URL_9=process.env.REACT_APP_API_URL_9;

var T1 = 1;
var T2 = 0;

const mapContainerStyle = {
  width: "100vw",
  height: "100vh"
};

const center={
  lat:10.9878,
  lng:-74.7889
};

const options={
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl:true,
  streetViewControl: true,
};

const valueText = (value) => {
  //setValueSlider(value);
};

var count = 0;

class App extends Component {

  constructor(){
    super();
    this.state={
      coord:{
        lat:10.9878,
        lng:-74.7889
     },
      coord2:{
        lat2: 10.9878,
        lng2:-74.7889
      },
      lat:8.75,
      lng:-75.883,
      lat2:8.75,
      lng2:-75.883,
      coord_text1:{lng:"XXXX",lat:"XXXX",alt:"XXXX",time:"0000"},
      coord_text2:{lng2:"XXXX",lat2:"XXXX",alt2:"XXXX",time2:"0000"},
      sw_realtime:true,
      sw_history:false,
      sw_truck1: true,
      sw_truck2: false,
      history:[],
      history2:[],
      date_in:new Date(),
      date_fin:new Date(),
      openPanel:false,
      ID1:{value:"1",label:"Camion 1"},
      ID2:{value:"2",label:"Camion 2"},
      Opt:[],
      Opt2:[],
      rm:{value:"XXXX"},
      rm2:{value:"XXXX"},
      rmp:[],
      rmp2:[],
      sw_his_tag1:false,
      sw_his_tag2:false,
      sw_tag1:true,
      sw_tag2:false,
      T1 : 0,
      T2 : 0

    }

  }

  callAPI_actual(){

    axios.post(API_URL_1,({ //LAST TRUCK 1
      ID1:((this.state.ID1).value)
    }))
      .then((res) => {
        console.log('last')
        console.log(res.data);
        try{
          this.setState({
            coord:{
              lat:res.data[0].lat,
              lng:res.data[0].lng,
            }
          });

          var buff_lat=(res.data[0].lat).toString();
          var buff_lng=(res.data[0].lng).toString();
          var buff_time=(res.data[0].timegps).toString();
          var buff_alt=(res.data[0].alt).toString();        

          this.setState({
            coord_text1: { lng: buff_lng, lat: buff_lat, alt: buff_alt, time: buff_time}
          });
        }catch(error){
          console.log(Error);
        };
      });
  }

  callAPI_actual2(){
    axios.post(API_URL_6,({ //LAST TRUCK 2
      ID2:((this.state.ID2).value)
    }))
      .then((res) => {
        console.log(res.data);
        try{
          this.setState({
            coord2:{
              lat2:res.data[0].lat,
              lng2:res.data[0].lng
            }
          });

          var buff_lat2=(res.data[0].lat).toString();
          var buff_lng2=(res.data[0].lng).toString();
          var buff_time2=(res.data[0].timegps).toString();
          var buff_alt2=(res.data[0].alt).toString();

          this.setState({
            coord_text2: { lng2: buff_lng2, lat2: buff_lat2, alt2: buff_alt2, time2: buff_time2},
          });
        }catch(error){
          console.log(Error);
        };
      });
  }
  
  callAPI_history(){
    axios.post(API_URL_2,({ //HISTORY TRUCK 1
      timestamp_in:(this.state.date_in).getTime(),
      timestamp_fin:(this.state.date_fin).getTime(),
      ID1:((this.state.ID1).value)
    }))
      .then((res) => { 
        console.log('history')
        console.log(res.data)
        var buff = (res.data);
        this.setState({
          history:buff
        });
      });

  }

  callAPI_history2(){
    axios.post(API_URL_7,({ //HISTORY TRUCK 2
      timestamp_in:(this.state.date_in).getTime(),
      timestamp_fin:(this.state.date_fin).getTime(),
      ID2:((this.state.ID2).value)
    }))
      .then((res) => { 
        var buff2 = (res.data); 
        this.setState({
          history2:buff2
        });
      });

  }

  callAPI_time(){
    console.log('got it')
    axios.post(API_URL_4, ({
      timestamp_in:(this.state.date_in).getTime(),
      timestamp_fin:(this.state.date_fin).getTime(),
      ID:((this.state.ID).value)
    }))
      .then((res)=> {
        for (var h=0; h<((res.data).length); h++){
          this.state.thistory.push(((res.data)[h]).timegps)
        } console.log(this.state.thistory)
      }).catch(err => console.log(err));
  }

  callAPI_rmp(){
    axios.post(API_URL_8,({  //RPM TRUCK 1
      ID1:((this.state.ID1).value)
    }))
    .then((res)=> { 
      console.log('rpm 1')
      console.log(res.data)
      var rrp = (res.data);
      this.setState({
        rmp:rrp
      });
    }).catch(err => console.log(err));
  }

  callAPI_rmp2(){
    axios.post(API_URL_9,({  //RPM TRUCK 2
      ID2:((this.state.ID2).value)
    }))
    .then((res)=> { 
      console.log('rpm 2')
      console.log(res.data)
      var rrp2 = (res.data);
      this.setState({
        rmp2:rrp2
      });
    }).catch(err => console.log(err));
  }

  set_timer1(){
    this.timer1 = setInterval(()=>{this.callAPI_actual()}, 1000);
  }

  set_timer2(){
    this.timer2 = setInterval(()=>{this.callAPI_history()},1000);
  }

  set_timer3(){
    this.timer3 = setInterval(()=>{this.callAPI_actual2()},1000);
  }

  set_timer4(){
    this.timer4 = setInterval(()=>{this.callAPI_history2()},1000);
  }

  set_timer5(){
    this.timer3 = setInterval(()=>{this.callAPI_time()},1000);
  }

  set_timer6(){
    this.timer6 = setInterval(()=>{this.callAPI_rmp()},1000);
  }

  set_timer7(){
    this.timer7 = setInterval(()=>{this.callAPI_rmp2()},1000);
  }

  componentDidMount(){
    console.log("Al components mounted");
    this.set_timer1();
    this.set_timer3();
    this.set_timer2();
    this.set_timer4();
    this.set_timer5();
    this.set_timer6();
    this.set_timer7();
  }

  set_truck1_checked(){
    this.setState({T1: 1});
  }

  set_truck1_unchecked(){
    this.setState({T1: 0});
  }

  set_truck2_checked(){
    this.setState({T2: 1});
  }

  set_truck2_unchecked(){
    this.setState({T2: 0});
  }

  set_rmp(){
    if(!(this.state.rmp === undefined)){
      if(this.state.T1 === 1){
        if(!(this.state.count === 10045)){
          const rm = (this.state.rmp[count].rpm).toString()
          this.setState({
            rm
          });
          console.log('rm 1')
          console.log(rm)
          this.state.count = count + 1;
        }
        }
        }else{
        this.setState({rm: "XXXX"});
    }
  }

  set_rmp2(){
    if(this.state.T2 === 1){
      for (var f =0; f<this.rmp2.length; f++){
        this.setState({
          rm2: rmp2[f].toString()
        });
        var s = 0;
        for (var y=0; y<20; y++){
          s = s + y;
        }
      }
    }else{
      this.setState({rm2: "XXXX"});
    }
  }

  render(){return (

  
    <div>
      <title>GPS<span role="img" aria-label="Satellite Antenna">📡</span></title>
      <div style={{position:'absolute',top:'60%',left:'-1%',zIndex:'15'}}>
      <Button onClick={()=>{this.setState({openPanel:!this.state.openPanel})}} style={{color:'black',background:'white'}}>
      <span role="img" aria-label="Right arrow"> ➡️</span></Button>
      </div>

      <div style={{position:"absolute",top:"1%",left:"1%",width:"30%",height:"46.5%",backgroundColor:"white",zIndex:5}}>
      </div>

      <div>
        <h1 style={{top:"2%",left:"2%"}}>
        ZONETIC <span role="img" aria-label="Satellite Antenna">📡</span>
        </h1>
        <h4 style={{top:"10%",left:"2%"}}>
         Truck 1
        </h4>
        <h4 style={{top:"13.5%",left:"2%"}}>
        <body>{"Latitude: "+this.state.coord_text1.lat}</body>
        </h4>
        <h4 style={{top:"17%",left:"2%"}}>
        <body>{"Longitude: "+this.state.coord_text1.lng}</body>
        </h4>
        <h4 style={{top:"20.5%",left:"2%"}}>
        <body>{"Altitude: "+this.state.coord_text1.alt}</body>
        </h4>
        <h4 style={{top:"24%", left: "2%"}}>
        <body>{"Timestamp: "+(((new Date(parseFloat(this.state.coord_text1.time,10))) + "").split("("))[0]}</body>
        </h4>
        <h4 style= {{top: "27.5%", left: "2%"}}>
        Truck 2
        </h4>
        <h4 style={{top:"31%",left:"2%"}}>
        <body>{"Latitude: "+this.state.coord_text2.lat2}</body>
        </h4>
        <h4 style={{top:"34.5%",left:"2%"}}>
        <body>{"Longitude: "+this.state.coord_text2.lng2}</body>
        </h4>
        <h4 style={{top:"38%",left:"2%"}}>
        <body>{"Altitude: "+this.state.coord_text2.alt2}</body>
        </h4>
        <h4 style={{top:"41.5%", left: "2%"}}>
        <body>{"Timestamp: "+(((new Date(parseFloat(this.state.coord_text2.time2,10))) + "").split("("))[0]}</body>
        </h4>
      </div>

      <div style={{position: 'absolute', top:"35.5%", left: "1%", width: "30%", height:"5%", backgroundColor:"white", zIndex:5}}>


        <DiscreteSlider
          visible={this.state.sw_history}
          marks={this.array()}
          step={1}
           getAriaValueText={valueText}

        />

      </div>


      <div style={{position:"absolute",top:"63%",left:"1%",width:"15%",height:"16.5%",backgroundColor:"white",zIndex:5}}>
      </div>
      <div>
      <h4 style={{top: "64%", left: "2%"}}>
       RMP Truck 1
      </h4>
      <h4 style={{top:"68.5%", left: "2%"}}>
        <body>{"RMP: "+this.state.rm}</body>
      </h4>
      <h4 style2={{top: "73%", left: "2%"}}>
        RMP Truck 2
      </h4>
      <h4 style={{top: "77.5%", left: "2%"}}>
        <body>{"RMP: "+this.state.rm2}</body>
      </h4>
      </div>

      <SlidingPanel
        type={'left'}
       isOpen={this.state.openPanel}
        size={30}
       style={{zIndex:7}}
      >
        
        <div style={{position:'absolute',top:"51%",left:"31%",zIndex:"15"}}>
        <Button onClick={()=>{this.setState({openPanel:!this.state.openPanel})}} style={{color:'black',background:'white'}}>
        <span role="img" aria-label="Left arrow">⬅️</span>
        </Button>
        </div>
   
        <div style={{position:'absolute',top:'0px',left:'0px',zIndex:'5',width:'32%',height:'100%',backgroundColor:'white'}}>
        </div>

        <h5 style={{top:"5%",left:"2%",zIndex:"10",position:"absolute"}}>Real time position:</h5>

        <div style={{position:'absolute',top:"7.5%",left:"11.5%",zIndex:"10"}}>
        <Switch
          trackColor={{ false: "#767577", true: "#A04194" }}
          checked={this.state.sw_realtime}
          onChange={(checked)=>{
            if(checked){
              if(this.state.T1 === 1 && this.state.T2 === 0){
                this.set_timer1();
                clearInterval(this.timer3);
                this.setState({sw_tag1:true});
                this.setState({sw_tag2:false});
                this.setState({coord_text2:{lng2:"XXXX", lat2:"XXXX", alt2:"XXXX", time2:"0000"}});
              }else{
                if(this.state.T2 === 1 && this.state.T1 === 0){
                  this.set_timer3();
                  clearInterval(this.timer1);
                  this.setState({sw_tag1:false});
                  this.setState({sw_tag2:true});
                  this.setState({coord_text1:{lng:"XXXX", lat:"XXXX", alt:"XXXX", time:"0000"}});
                }else{
                  if(this.state.T1 === 1 && this.state.T2 === 1){
                    this.set_timer1();
                    this.set_timer3();
                    this.setState({sw_tag1:true, sw_tag2:true});
                  }
                }
              }
            }else{
              clearInterval(this.timer1);
              clearInterval(this.timer3);
              this.setState({
                coord_text1:{lng:"XXXX", lat:"XXXX", alt:"XXXX", time:"0000"},
                coord_text2:{lng2:"XXXX", lat2:"XXXX", alt2:"XXXX", time2:"0000"},
                sw_tag1:false,
                sw_tag2:false
              });
            }
            this.setState({
              sw_realtime:checked
            });
          }}
        />
       </div>

        <h5 style={{top:"10%",left:"2%",zIndex:"10",position:"absolute"}}>View Timeline:</h5>

        <div style={{position:"absolute",top:"12.5%",left:"11.5%",zIndex:"10"}}>
        <Switch
        trackColor={{ false: "#767577", true: "#A04194" }}
          checked={this.state.sw_history}
          onChange={(checked)=>{
            if(checked){
              if(this.state.T1 === 1 && this.state.T2 === 0){
                this.set_timer2();
                clearInterval(this.timer4);
                this.setState({sw_his_tag1:true});
                this.setState({sw_his_tag2:false});
              }else{
                if(this.state.T2 === 1 && this.state.T1 === 0){
                  this.set_timer4();
                  clearInterval(this.timer2);
                  this.setState({sw_his_tag2:true});
                  this.setState({sw_his_tag1:false});
                }else{
                  if(this.state.T1 === 1 && this.state.T2 === 1){
                    this.set_timer2();
                    this.set_timer4();
                    this.setState({sw_his_tag1:true});
                    this.setState({sw_his_tag2:true});
                  }
                }
              }
            }else{
              clearInterval(this.timer2);
              clearInterval(this.timer4);
              this.setState({
                sw_his_tag1:false,
                sw_his_tag2:false
              });
            }
            this.setState({
              sw_history:checked
            })
          }}
        /> 
        </div>

        <h5 style={{position:"absolute",top:"17%",left:"2%",zIndex:"10"}}>Initial date: </h5>

        <div style={{position:"absolute",top:"24%",left:"2%",zIndex:"12"}}>
        <DateTimePicker
          returnValue={'start'}
          onChange={(value) => this.setState({date_in: value})}
          value={this.state.date_in}
          maxDate={this.state.date_fin}
        />
        </div>

        <h5 style={{position:'absolute',top:"26%",left:"2%",zIndex:"10"}}>Final date: </h5>

        <div style={{position:'absolute',top:"33%",left:"2%",zIndex:"11"}}>
        <DateTimePicker
          returnValue={'start'}
          onChange={(value) => this.setState({date_fin: value})}
          value={this.state.date_fin}
          minDate={this.state.date_in}
          />
        </div>

          <h5 style={{top:"37.5%",left:"2%",zIndex:"10",position:"absolute"}}>Truck 1:</h5>

          <div style={{position:"absolute",top:"40%",left:"11.5%",zIndex:"10"}}>
            <Switch
              trackColor={{ false: "#767577", true: "#A04194" }}
              checked={this.state.sw_truck1}
              onChange={(checked)=>{
              if(checked){
                //isDisable={false}
                this.set_truck1_checked();
              }else{
                this.set_truck1_unchecked();
              }
              }}
            /> 
          </div>

          <h5 style={{top:"42.5%",left:"2%",zIndex:"10",position:"absolute"}}>Truck 2:</h5>

          <div style={{position:"absolute",top:"45%",left:"11.5%",zIndex:"10"}}>
            <Switch
              trackColor={{ false: "#767577", true: "#A04194" }}
              checked={this.state.sw_truck2}
              onChange={(checked)=>{
              if(checked){
                //isDisable={false}
                this.set_truck2_checked();
              }else{
                this.set_truck2_unchecked();
              }
              }}
            />
          </div>
      </SlidingPanel>

      <div>
        <LoadScript
         googleMapsApiKey={API_KEY}>

          <GoogleMap 
            mapContainerStyle={mapContainerStyle} 
            zoom={8} center={center} 
            options={options}
           > 

            <Polyline
              visible={this.state.sw_history}
              path={this.state.history}
              options={{
                strokeColor:'#301586',
              }}
           />

            <Polyline
              visible={this.state.sw_history}
              path={this.state.history2}
              options={{
                strokeColor:'#301586',
              }}
           /> 
    
            <Marker
              position={this.state.coord}
             icon={"/lorry-512_2.0.png"}
              visible={this.state.sw_tag1}
            />

            <Marker
              position={this.state.coord2}
              icon={"/lorry-512_2.0.png"}
              visible={this.state.sw_tag2}
            />

            <Marker
              position={this.state.history[(this.state.history.length-1)]}
              icon={"/mapa.svg"}
              visible={this.state.sw_his_tag1}
            />

            <Marker
              position={this.state.history2[(this.state.history2.length-1)]}
              icon={"/mapa.svg"}
              visible={this.state.sw_his_tag2}
            />

            <Marker
              position={this.state.history[0]}
              icon={"/ubicacion.svg"}
              visible={this.state.sw_his_tag1}
            />

            <Marker
              position={this.state.history2[0]}
              icon={"/ubicacion.svg"}
              visible={this.state.sw_his_tag2}
            />

          </GoogleMap>

        </LoadScript> 
      </div>

    </div>

  );
}
}
export default App;
