import React,{Component} from 'react';
import web3 from './web3';
import Web3 from 'web3';
import medicalsupply from './medicalsupply';
import Customer from './Customer'
import Doctor from './Doctor'
import MedicalCompany from './MedicalCompany'
import styles from './appStyles.module.css'



class AppClass extends Component{

	state={
       doctor:false,
       patient:false,
       medical_company:false,
       message:''
	}

	async componentDidMount(){

	}

	onSubmitPatient=(event)=>{
		this.setState({
			doctor:false,
			patient:true,
			medical_company:false
		})
	}
	onSubmitDoctor=(event)=>{
		this.setState({
			doctor:true,
			patient:false,
			medical_company:false
		})
	}
	onSubmitMedicalCompany=(event)=>{
		this.setState({
			doctor:false,
			patient:false,
			medical_company:true
		})		
	}
	render(){
		let template
		if(this.state.doctor){
			template=<div><Doctor/></div>
		}
		else if(this.state.patient)
		{
			template=<div><Customer/></div>
		}
		else if(this.state.medical_company){
			template=<div><MedicalCompany/></div>
		}
		return (
			<div id={styles.outer}>
				<div className={styles.inner}>
					<button className={styles.button} onClick={this.onSubmitDoctor}><h1>Doctor</h1></button>
				</div>
				<div className={styles.inner}>
					<button className={styles.button} onClick={this.onSubmitMedicalCompany}><h1>MedicalCompany</h1></button>
				</div>
				<div className={styles.inner}>
					<button className={styles.button} onClick={this.onSubmitPatient}><h1>Patient</h1></button>
				</div>

				
  				

		     	<div>
					{template}
				</div>
			</div>

			)
	}
}

export default AppClass;