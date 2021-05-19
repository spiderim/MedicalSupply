import React,{Component} from 'react';
import web3 from './web3';
import Web3 from 'web3';
import medicalsupply from './medicalsupply';
import MedicalCompany from './MedicalCompany'
import styles from './appStyles.module.css'


class Doctor extends Component{

	constructor(props){
		super(props);

		this.state={
			patient:'',
			current_account:'',
			current_account_balance:'',
			medicine:'',
			message:'',
			customer:'',
			doctor:'',
			loading:true,
			small_loading:false
	   }
	}

	async componentDidMount(){
		const doctor=await medicalsupply.methods.doctor().call();
		const accounts=await web3.eth.getAccounts();
		const current_account_balance=await web3.eth.getBalance(accounts[0]);
		const medicine=await medicalsupply.methods.getMedicineName().call();
		const customer=await medicalsupply.methods.customer().call();
		

		this.setState({
			current_account:accounts[0],
			current_account_balance:current_account_balance/1000000000000000000,
			medicine:medicine,
			customer:customer,
			doctor:doctor

		})
		this.setState({
			loading:false
		})
	}

	enterPatientAddress=(event)=>{
		this.setState({
			patient:event.target.value
		})
	}

	enterMedicineName=(event)=>{
		this.setState({
			medicine:event.target.value
		})
	}

	onSubmit=async(event)=>{
		event.preventDefault();
		this.setState({
			message:'Please Wait....',
			small_loading:true
		})
		const accounts=await web3.eth.getAccounts()
		await medicalsupply.methods.takeCare(this.state.patient,this.state.medicine).send({
			from:accounts[0],
			gas:3000000
		})
		this.setState({
			message:'Submited Sucessfully!',
			small_loading:false
		})
		event.preventDefault();
	}


	render(){
		let template
		let orderStatus
		let loading


		if(this.state.current_account==this.state.doctor){
			if(this.state.medicine=='abc'){
			orderStatus=(
				<div>

				</div>
				)

		   }
			else{
				orderStatus=(
					<div>
						<p>patient Address:{this.state.customer}</p>
						<p>medicine : {this.state.medicine}</p>
					</div>
					)			
			}

			template=(
					<div>
					{orderStatus}
					</div>

				)
		}else{
			template=(
				<div>

				</div>
			)
		}
		


		return (
			<div>

			{this.state.loading?<div><i id={styles.mid_buffer} class="fa fa-spinner fa-spin"></i><h1>Loading..</h1></div>:
			<div>

				<h4>********DOCTOR********</h4>
				<p>current metamask account <b>{this.state.current_account}</b></p>
				<p>current metamask account balance <b>{this.state.current_account_balance} ether</b></p>
				<div className={styles.one_form}>

					<form className={styles.form}  onSubmit={this.onSubmit}>
					 <h3 className={styles.form_title}>Enter Patient Detail</h3>
						<div className={styles.form_div}>
							
							<input className={styles.form_input} onChange={this.enterPatientAddress}/>
							<label className={styles.form_label}>Patient address: </label>
						</div>
						<div className={styles.form_div}>
							<input className={styles.form_input} onChange={this.enterMedicineName}/>
							<label className={styles.form_label}>Medicine Name: </label>
						</div>

					
						<button className={styles.form_button} type="submit">Submit</button>
							{this.state.small_loading?<div><i class="fa fa-spinner fa-spin"></i>{this.state.message}</div>
					:<div>{this.state.message}</div>}
					</form>
					</div>
				
					<br/>
					<h4>STATUS</h4>
					<hr/>
					{template}
					
					<hr/>
					</div>

				
			}
			</div>

			)
	}
}

export default Doctor;