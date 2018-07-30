/** MODULE 1 CREATE BLOCKCHAIN */
const crypto = require('crypto');

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
        this.create_block();
    }

    create_block(proof = 1 , previous_hash = '0',data={}){
        var block = new Block({
            index: this.chain.length+1,
            timestamp: new Date().getTime(),
            previous_hash : previous_hash,
            data: data,
            proof: proof
        });

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

    isChainValid(){
        var previous_block = this.chain[0];
        var block_index  = 1;

        while(block_index<this.chain.length){
            var block = this.chain[block_index];
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
}

module.exports = BlockChain;