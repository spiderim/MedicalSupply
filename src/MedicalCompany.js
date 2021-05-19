import React,{Component} from 'react';
import web3 from './web3';
import Web3 from 'web3';
import medicalsupply from './medicalsupply';
import styles from './appStyles.module.css'

class MedicalCompany extends Component{

	state={
			suppliers:'',
			messageship:'',
			current_account:'',
			current_account_balance:'',
			suppliers:[],
			status:'',
			order_id:'',
			customer:'',
			medical_company:'',
			medicine:'',
			doctor:'',
			loading:true,
			small_loading:false
	}

	async componentDidMount(){
		const accounts=await web3.eth.getAccounts();
		const current_account_balance=await web3.eth.getBalance(accounts[0]);
		const status=await medicalsupply.methods.getStatus().call();
		const order_id=await medicalsupply.methods.getOrderId().call();
		const customer=await medicalsupply.methods.customer().call();
		const medical_company=await medicalsupply.methods.medical_company().call();
		const doctor=await medicalsupply.methods.doctor().call();
		const medicine=await medicalsupply.methods.getMedicineName().call();

		this.setState({
			current_account:accounts[0],
			current_account_balance:current_account_balance/1000000000000000000,
			status:status,
			order_id:order_id,
			customer:customer,
			medical_company:medical_company,
			doctor:doctor,
			medicine:medicine
		})
		this.setState({
			loading:false
		})
	}


	onSubmitShip=async(event)=>{
		event.preventDefault();
		this.setState({
			small_loading:true,
			messageship:'Please wait...'
		})
		const accounts=await web3.eth.getAccounts()
		const medicalowner=await medicalsupply.methods.medical_company().call();
		console.log('Medical owner ',medicalowner)

		await medicalsupply.methods.send_order(this.state.supplier,this.state.cost).send({
			from:accounts[0],
			gas:3000000
		});

		const supls=medicalsupply.methods.getSuppliers().call();
		const orderid=await medicalsupply.methods.getOrderId().call();		

		this.setState({
			suppliers:supls,
			small_loading:false,
			messageship:'congrats your order has been shipped having orderid '+(orderid)
		})
		event.preventDefault();

	}

	enterShipperAddress=(event)=>{
		this.setState({
			supplier:event.target.value
		})
	}



	enterCost=(event)=>{
		this.setState({
			cost:event.target.value
		})
	}


	render(){
		let template
		let orderStatus

		if(this.state.current_account==this.state.medical_company){
			if(this.state.status=='1'){
				orderStatus=(
					<div>

					<p>customer : {this.state.customer} </p><p> medicine: {this.state.medicine}</p>

                    <p>doctor : {this.state.doctor}</p>
                    <p>orderid : {this.state.order_id}</p>
                    <p>please send order</p>
					</div>
					)
			}
			else if(this.state.status=='2'){
				orderStatus=(
					<div>

					<p>customer : {this.state.customer} </p><p> medicine: {this.state.medicine}</p>

                    <p>doctor : {this.state.doctor}</p>
                    <p>orderid : {this.state.order_id}</p>
                    <p>Medicine is in the way to customer</p>
					</div>
					)
			}
			else if(this.state.status=='3'){
				orderStatus=(
					<div>

					<p>customer : {this.state.customer} </p><p> medicine: {this.state.medicine}</p>

                    <p>doctor : {this.state.doctor}</p>
                    <p>orderid : {this.state.order_id}</p>
                    <p>Order delivered by customer</p>
					</div>
					)				
			}
			else{
				orderStatus=<p></p>
			}
			template=<p>{orderStatus}</p>
		}else{
			template=<p></p>
		}
		
		return (
			<div>{this.state.loading?<div><i id={styles.mid_buffer} class="fa fa-spinner fa-spin"></i><h1>Loading..</h1></div>:
			<div>
				
				<h4>********MEDICAL COMPANY********</h4>
				<p>current metamask account <b>{this.state.current_account}</b></p>
				<p>current metamask account balance <b>{this.state.current_account_balance} ether</b></p>

				<div className={styles.one_form}>


		          <form className={styles.form} onSubmit={this.onSubmitShip}>
		          	<h3 className={styles.form_title}>Enter Shipper Detail</h3>
		        	<div className={styles.form_div}>
						<input className={styles.form_input} onChange={this.enterShipperAddress}/>
						<label className={styles.form_label}>Shipper Address: </label>
		        	</div>

		        	<div className={styles.form_div}>
						<input className={styles.form_input} type="number" step="any" onChange={this.enterCost}/>
						<label className={styles.form_label}>Cost: </label>
		        	</div>

					<button className={styles.form_button} type="submit">Ship Order</button>
				  </form>
				</div>

				{this.state.small_loading?<div><i class="fa fa-spinner fa-spin"></i>{this.state.messageship}</div>:

				<div>{this.state.messageship}</div>}
				<br/>
				<h4>STATUS</h4>
				<hr/>
			    {template}
				<hr/>
			</div>}</div>

			)
	}
}

export default MedicalCompany;