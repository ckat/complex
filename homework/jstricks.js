var Payment = function(){
	this.signs = [];
};

Payment.prototype = {
	signs:[],

	addSign: function(signer){
		this.signs.push(signer);
	},

	testFunc:function(){
		var x = [8,9,10];
		x.splice(1,1,5,5,5);
		var num = 2334.344;
		num = num.toFixed(2);
		console.log(num);
		return [2, 3, 4, 5].splice(2,1,[9,8]);
	}
};

var payment1 = new Payment(),
	payment2 = new Payment();

payment1.addSign('Account');
payment1.addSign('Director');
payment2.addSign('the Account');
payment2.addSign('Acceptor');

console.log(JSON.stringify(payment1.testFunc(payment1.signs,2,4)));