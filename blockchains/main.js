const SHA256 =  require('crypto-js/sha256');

/**
 * Informação que será inserida no bloco
 */
class Trasaction{
    constructor(fromAddress, toAddress, amount){
        this.toAddress = toAddress;
        this.fromAddress = fromAddress
        this.amount = amount;
    }
}

/**
 * Estrutura do bloco
 */
class Block {
    constructor(timestamp, transaction, previousHash = ''){
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.nonce = 0;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    /**
     * Função para calcular a hash do bloco
     */
    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }


    /**
     * 
     * Função para 'minerar' o bloco
     */
    mineBlock(dificulty){
        while(this.hash.substring(0,dificulty) !== Array(dificulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

/**
 * Correte ou lista de blocos
 */
class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.dificulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    /**
     * Função para criar o primeiro bloco
     */
    createGenesisBlock(){
        return new Block(Date.now(), "Genesis Block", "0");
    }
    /**
     * Pega o ultimo bloco
     */
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    /**
     * 
     * Cria um novo bloco, sendo essa uma transação para a carteira de quem mineirou a correte
     */
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.dificulty);

        console.log("Block successed mined");
        this.chain.push(block);

        this.pendingTransactions = [
            new Trasaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    /**
     * 
     * Cria nova 'transação'
     */
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    /**
     * 
     * Percorre a correte, para calcular o saldo 
     */
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transaction){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    /**
     * Recalcula as Hash de todos os blocos, comparandoas com o seus próximos.
     */
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const curretBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (curretBlock.hash !== curretBlock.calculateHash()){
                return false;
            }

            if (previousBlock.hash !== previousBlock.calculateHash()){
                return false;
            }
        }
        return true;
    }
}

let coin = new Blockchain();

coin.createTransaction(new Trasaction('address1', 'address2', 100));
coin.createTransaction(new Trasaction('address2', 'address1', 50));


console.log('\n Starting mining...');
coin.minePendingTransactions('mine-address');
console.log('\nbalance of \'mine-address\' is: ' + coin.getBalanceOfAddress('mine-address'));

console.log('\n Starting mining...');
coin.minePendingTransactions('mine-address');
console.log('\nbalance of \'mine-address\' is: ' + coin.getBalanceOfAddress('mine-address'));

console.log('\n');

for (let i = 0; i < coin.chain.length; i++){
    console.log(coin.chain[i]);
    console.log('-----------------------------------------------------------------------------------\n');
}
console.log((coin.isChainValid()) ? 'Blockchain is valid\n' : 'Blockchain is not valid\n');
