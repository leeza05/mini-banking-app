import mongoose from "mongoose";
const {Schema} = mongoose;

const transactionSchema = new Schema({
    account:{
        type:Schema.Types.ObjectId,
        ref:'Account',
        required:true
    },
    type:{
        type:String,
        enum:['DEBIT','CREDIT'],
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    balanceAfter:{
        type:Number,
        required:true
    }
},{timestamps:true}
);

const Transaction = mongoose.model('Transaction',transactionSchema);

export default Transaction;