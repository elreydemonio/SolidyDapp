const TasksContract = artifacts.require("TasksContract");

contract("TasksContract", () =>{
    before(async () => {
       this.tasksContract = await TasksContract.deployed()
    })
    it('migrate deployed successfully', async () => {
        const address = this.tasksContract.address;
        assert.notEqual(address, null);
        assert.notEqual(address, undefined);
        assert.notEqual(address, 0x0);
        assert.notEqual(address, "");
    })
    it('get Tasks List', async () => {
        const tasksCounter = await this.tasksContract.TaskCounter()
        const task = await this.tasksContract.tasks(tasksCounter) 

        assert.equal(task.id.toNumber(), tasksCounter.toNumber());
        assert.equal(task.title, "Mi primer tarea de la semana");
        assert.equal(task.description, "Dormir");
        assert.equal(task.done, false);
        assert.equal(tasksCounter, 1);
    })
    it("task created successfully", async () => {
        const result = await this.tasksContract.createTask("some task two", "description two");
        const taskEvent = result.logs[0].args;
        const tasksCounter = await this.tasksContract.TaskCounter();
        assert.equal(tasksCounter, 2);
        assert.equal(taskEvent.id.toNumber(), 2);
        assert.equal(taskEvent.title, "some task two");
        assert.equal(taskEvent.description, "description two");
        assert.equal(taskEvent.done, false);
    })
    it("task toggled done", async () => {
        const result = await this.tasksContract.toggleDone(1);
        const taskEvent = result.logs[0].args;
        const task = await this.tasksContract.tasks(1);
    
        assert.equal(task.done, true);
        assert.equal(taskEvent.id.toNumber(), 1);
        assert.equal(taskEvent.done, true);
    });
})