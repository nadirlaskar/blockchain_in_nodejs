/** MODULE 1 CREATE BLOCKCHAIN */
const crypto = require('crypto');
const axios = require('axios');

class Block{
    constructor(config){
        this.index = config.index;
        this.timestamp = config.timestamp
        this.previous_hash = config.previous_hash;
        this.data = config.data;
        this.proof = config.proof;
    }
}

class BlockChain {

    get difficulty(){
        return "0000"; //Starts with 4 zero.
    }

    constructor(){
        this.chain = [];
        console.log("Creating Genisis Block!");

        this.transactions = []; //create transaction
        this.create_block();
        this.nodes = new Set();
    }

    create_block(proof = 1 , previous_hash = '0',data={}){
        var block = new Block({
            index: this.chain.length+1,
            timestamp: new Date().getTime(),
            previous_hash : previous_hash,
            data: this.transactions,
            proof: proof
        });

        this.transactions = []; //empty transactions
        this.chain.push(block);

        return block;
    }

    get_previous_block(){
       return this.chain[this.chain.length-1];
    }

    proof_of_work(previous_proof){
        var new_proof = 1;
        var check_proof =  false;
        
        while(check_proof===false){
            var work = (new_proof*new_proof-previous_proof*previous_proof);
            var hash = crypto.createHash('sha256').update(""+work).digest('hex');
            if(hash.startsWith(this.difficulty)){
                check_proof = true;
            }else new_proof++;
        }

        return new_proof;
    }

    hash(block){
        return crypto.createHash('sha256').update(JSON.stringify(block)).digest('hex');
    }

    isChainValid(checkChain = this.chain){
        var previous_block = checkChain[0];
        var block_index  = 1;

        while(block_index<checkChain.length){
            var block = checkChain[block_index];
            if(block.previous_hash!=hash(block)){
                return false;
            }

            var previous_proof = previous_block.proof;
            var proof = block.proof;

            var work = (proof*proof-previous_proof*previous_proof);
            var hash = crypto.createHash('sha256').update(""+work).digest('hex');
            
            if(!hash.startsWith(this.difficulty)){
                return false;
            }

            previous_block = block;
            block_index ++;
        }

        return true;
    }

    // Add Transactions
    addTransaction(sender,receiver,amount){
        this.transactions.append({
            sender: sender,
            receiver:receiver,
            amount:amount
        });

        return this.get_previous_block().index+1;
    }

    
    add_node(address){
        var addr = address;; //parse address;
        this.nodes.add(address); //pdate address to node set.
    }

    // Replace shorter chain with larger chain
    replace_chain(){
        var network = this.nodes;
        var longestChain = null;
        var max_length = this.chain.length;  
        await network.forEach(async (addr)=>{
            axios.get(`${addr}/blockchain`).then((n)=>{
                if(n.length>max_length&&this.isChainValid(n.chain)){
                    max_length = n.length;
                    longestChain = n.chain;
                }
            }).catch(e=>console.log(`Not Found Node ${addr}` ));
        });

        if(longestChain!=null){
            this.chain = longestChain;
        }

        return longestChain!=null;

    }

}
module.exports = BlockChain;