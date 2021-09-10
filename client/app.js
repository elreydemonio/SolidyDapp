App = {
    contracts: {},
    init: async () => {
        console.log('Loaded')
        await App.loadEthereum()
        await App.loadAccount()
        await App.loadContracts()
        await App.render()
        await App.renderTasks()
    },
    loadEthereum: async () => {
        if (window.ethereum) {
            App.web3Provider = window.ethereum
            await window.ethereum.request({ method: 'eth_requestAccounts' })
        } else if(window.web3){
            web3 = new Web3(window.web3.currentProvider);
        }else {
           console.log('No ethereum no estas utilizando con un navegandor con metamask') 
        }
    },
    loadAccount: async () => {
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
        App.account = account[0]
    },
    loadContracts: async () => {
        const res = await fetch("TasksContract.json")
        const tasksContractJSON = await res.json()
        App.contracts.TasksContract = TruffleContract(tasksContractJSON);
        App.contracts.TasksContract.setProvider(App.web3Provider);
        App.tasksContract = await App.contracts.TasksContract.deployed();
    },
    render: async () => {
        document.getElementById("account").innerText = App.account;
    },
    renderTasks: async () => {
        const tasksCounter = await App.tasksContract.TaskCounter();
        const taskCounterNumber = tasksCounter.toNumber(); 
        let html = "";
        for (let i = 1; i <= taskCounterNumber; i++) {
            const task = await App.tasksContract.tasks(i);
            const taskId = task[0].toNumber();
            const taskTitle = task[1];
            const taskDescription = task[2];
            const taskDone = task[3];
            const taskCreatedAt = task[4]; 
            let taskElement = `<div class="card bg-dark rounded-0 mb-2">
            <div class="card-header d-flex justify-content-between align-items-center">
              <span>${taskTitle}</span>
              <div class="form-check form-switch">
                <input class="form-check-input" data-id="${taskId}" type="checkbox" onchange="App.toggleDone(this)" ${
                  taskDone === true && "checked"
                }>
              </div>
            </div>
            <div class="card-body">
                <span>${taskDescription}</span>
                <span>${taskDone}</span>
                <p class="text-muted">Task was created ${new Date(
                        taskCreatedAt * 1000
                    ).toLocaleString()}</p>
                </label>
            </div>
            </div>`;
            html += taskElement;     
        }
        document.querySelector("#TaskList").innerHTML = html;
    },
    createTask: async (title, description) => {
        const result = await App.tasksContract.createTask(title, description, {
            from: App.account,
          });
        console.log(result.logs[0].args)
    },
    toggleDone: async (element) => {
        const taskId = element.dataset.id;
        await App.tasksContract.toggleDone(taskId, {
          from: App.account,
        });
        window.location.reload();
      }
}

App.init()