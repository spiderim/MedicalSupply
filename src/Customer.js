import React,{Component} from 'react';
import web3 from './web3';
import Web3 from 'web3';
import medicalsupply from './medicalsupply';
import styles from './appStyles.module.css'



class Customer extends Component{

	constructor(props){
		super(props);

		this.state={
		medical_company:'',
		initial_value:'',
		messageorder:'',
		order_id:'',
		payment:'',
		messagedelivery:'',
		customer:'',
		doctor:'',
		current_account:'',
		current_account_balance:'',
		medicine:'',
		status:'0',
		temp_medical_cmp:'',
		cost:'',
		loading:true,
		small_loading:false,
		small_loadingd:false

	   }
	}



	async componentDidMount(){

		const accounts=await web3.eth.getAccounts();
		const current_account_balance=await web3.eth.getBalance(accounts[0]);
		const customer=await medicalsupply.methods.customer().call();
		const status=await medicalsupply.methods.getStatus().call();
		const doctor=await medicalsupply.methods.doctor().call();
		const medicine=await medicalsupply.methods.getMedicineName().call();
		const order_id=await medicalsupply.methods.getOrderId().call();
		const temp_medical_cmp=await medicalsupply.methods.medical_company().call();
		const cost=await medicalsupply.methods.getCost().call();

		this.setState({
			current_account:accounts[0],
			current_account_balance:current_account_balance/1000000000000000000,
			status:status,
			customer:customer,
			doctor:doctor,
			medicine:medicine,
			order_id:order_id,
			temp_medical_cmp:temp_medical_cmp,
			cost:cost


		})
		this.setState({
			loading:false
		})


	}


	enterMedicalCompanyAddress=(event)=>{
		this.setState({
			medical_company:event.target.value
		})
	}

	enterValue=(event)=>{
		this.setState({
			initial_value:event.target.value
		})
	}

	onSubmitOrder=async(event)=>{
		event.preventDefault();

		const accounts=await web3.eth.getAccounts();

		this.setState({
			small_loading:true,
			messageorder:'order is in progress...'
		})


		await medicalsupply.methods.make_order(this.state.medical_company).send({
			from:accounts[0],
			value:web3.utils.toWei(this.state.initial_value,'ether')
		});

		const orderid=await medicalsupply.methods.getOrderId().call()



		this.setState({
			small_loading:false,
			messageorder:'congrats your order has been placed having orderid '+(orderid)
		})
	}


	payment=(event)=>{
		this.setState({
			payment:event.target.value
		})
	}

	onDelivery=async(event)=>{
		event.preventDefault();		
		const accounts=await web3.eth.getAccounts()
		this.setState({
			small_loadingd:true,
			messagedelivery:'wait your payment is in progress.......'
		})

		const orderid=await medicalsupply.methods.getOrderId().call();

		await medicalsupply.methods.delivered().send({
			from:accounts[0],
			value:web3.utils.toWei(this.state.payment,'ether')
		});
		this.setState({
			small_loadingd:false,
			messagedelivery:'congrats you have delivered your order having orderid '+(orderid)
		})
		event.preventDefault();	

	}

	render(){

		let medical_reciept_template
		let orderStatus

		if(this.state.customer!=this.state.current_account){
			medical_reciept_template=<div>you have no medical reciept</div>
			
		}
		else{

			if(this.state.status=='0'){
				orderStatus=<p>you have not yet ordered your item</p>
		   }
		   else if(this.state.status=='1'){
			    orderStatus=(
			    	<div>

			    	<p>you have ordered your item having orderid {this.state.order_id}</p>
			    	<p>Medical Company Address - <b>{this.state.temp_medical_cmp}</b></p>

			    	</div>
			    	)
		   	
		   }
		   else if(this.state.status=='2'){
			    orderStatus=(
			    	<div>
			    	<p>your order is shipped by Medical Company having orderid {this.state.order_id}</p>
			    	<p>Medical Company Address - <b>{this.state.temp_medical_cmp}</b></p>
			    	<p>Total cost of medicine : {this.state.cost} ether</p>

			    	</div>
			    	)
		   }
		   else if(this.state.status=='3'){
			    orderStatus=(
			    	<div>
			    	<p>you have delivered your item sucessfully with order id {this.state.order_id}!</p>
			    	<p>Medical Company Address - <b>{this.state.temp_medical_cmp}</b></p>

			    	</div>
			    	)
		   }

			medical_reciept_template=(
					<div>
				     <p>Doctors Address - <b>{this.state.doctor}</b></p>
				    <p>medicine name - <b>{this.state.medicine}</b></p>
				    
				    <h4>STATUS</h4>
				    {orderStatus}

				</div>
				)
		}



		return (
			<div>
			{this.state.loading?<div><i id={styles.mid_buffer} class="fa fa-spinner fa-spin"></i><h1>Loading..</h1></div>:
			<div>

				<h4>********PATIENT********</h4> 
				<p>current metamask account <b>{this.state.current_account}</b></p>
				<p>current metamask account balance <b>{this.state.current_account_balance} ether</b></p>
				<div className={styles.one_form}>
					<form className={styles.form} onSubmit={this.onSubmitOrder}>
						<h3 className={styles.form_title}>Enter Medical Company Detail</h3>
						<div className={styles.form_div}>
							<input className={styles.form_input} onChange={this.enterMedicalCompanyAddress}/>
							<label className={styles.form_label}>Medical Company Address: </label>
						</div>

						<div className={styles.form_div}>
							<input className={styles.form_input} onChange={this.enterValue}/>
							<label className={styles.form_label}>value: </label>
						</div>
						<button className={styles.form_button} type="submit">Make Order</button>
				</form>
				<form className={styles.form} onSubmit={this.onDelivery}>
						<h3 className={styles.form_title}>Deliver Order</h3>
						<div className={styles.form_div}> 
							<input className={styles.form_input} onChange={this.payment}/>
							<label className={styles.form_label}>payment: </label>
						</div>
						<button className={styles.form_button} type="submit">Deliver order</button>
						{this.state.small_loadingd?<div><i class="fa fa-spinner fa-spin"></i>{this.state.messagedelivery}</div>:
						<div>{this.state.messagedelivery}</div>}
					</form>
				</div>
				{this.state.small_loading?<div><i class="fa fa-spinner fa-spin"></i>{this.state.messageorder}</div>:
						<div>{this.state.messageorder}</div>}
				<hr/>
				<h4 className={styles.form_title}>Your medical reciept</h4>
				<div>{medical_reciept_template}</div>
				<hr/>

			</div>}</div>

			)
	}
}

export default Customer;