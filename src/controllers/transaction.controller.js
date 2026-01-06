import Account from "../models/Account.js";
import Transaction from "../models/Transactions.js";

export const creditAmount = async (req,res)=>{
    const {accountId,amount}= req.body;

    const userId= req.user.userId;

    try{
        if(!accountId || !amount){
            return res.status(400).json({message:'All fields are required'});
        }
        if(amount <=0){
            return res.status(400).json({message:'Amount must be greater than zero'});
        }
        const account= await Account.findOne({_id: accountId, user: userId});

        if(!account){
            return res.status(403).json({message:'Access denied'});
        }
        account.balance += amount;
        await account.save();

        const transaction = new Transaction({
            account: account._id,
            type: 'CREDIT',
            amount: amount,
            balanceAfter: account.balance
        });
        await transaction.save();

        return res.status(200).json({message:'Amount credited successfully',
            balance: account.balance,
            transactionId: transaction._id
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:'Internal server error'});
    }
}

export const debitAmount = async(req,res)=>{
    const {accountId,amount}= req.body;
    const userId= req.user.userId;

    try{
        if(!accountId || !amount){
            return res.status(400).json({message:'All fields are required'});
        }
        if(amount <=0){
            return res.status(400).json({message:'Amount must be greater than zero'});
        }

        const account = await Account.findOne({
            _id: accountId,
            user: userId
        })

        if(!account){
            return res.status(403).json({message:'Access denied'});
        }

        if(amount > account.balance){
            return res.status(400).json({message:'Insufficient balance'});
        }

        account.balance -= amount;
        await account.save();

        const transaction = new Transaction({
            account: account._id,
            type: 'DEBIT',
            amount: amount,
            balanceAfter: account.balance
        });
        await transaction.save();

        return res.status(200).json({message:'Amount debited successfully',
            balance: account.balance,
            transactionId: transaction._id
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:'Internal server error'});
    }
}

export const getTransactionsbyAccount = async(req,res)=>{
    const {accountId}= req.params;
    const userId= req.user.userId;

    if(!accountId){
        return res.status(400).json({message:'Account ID is required'});
    }

    try{
        const account = await Account.findOne({
            id: accountId,
            user: userId
        })
        if(!account){
            return res.status(403).json({message:'Access denied'});
        }

        const transactions = await Transaction.find({
            account: accountId
        }).sort({createdAt:-1});

        return res.status(200).json({transactions});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:'Internal server error'});
    }
}

export const getAllTransactions = async(req,res)=>{
    const userId= req.user.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try{
        const accounts = await Account.find({user: userId}).select('_id');

        if(!accounts.length){
            return res.status(200).json({transactions: [],
                page,
                limit,
                total:0});
        }
            const accountIds = accounts.map(acc => acc._id);
            const transactions = await Transaction.find({
                account: {$in: accountIds}
            })
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit);

            const total = await Transaction.countDocuments({
                account: {$in: accountIds}
            });

            return res.status(200).json({transactions,
                page,
                limit,
                total});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:'Internal server error'});
        }
    }