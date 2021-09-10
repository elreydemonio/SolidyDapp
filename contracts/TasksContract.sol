// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract TasksContract {
    uint public TaskCounter = 0;
    constructor(){
        createTask("Mi primer tarea de la semana", "Dormir");
    }
    struct Task{
        uint id;
        string title;
        string description;
        bool done;
        uint256 createAt;
    }
    event TaskCreated(
        uint256 id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );
     event TaskToggledDone(uint256 id, bool done);
    mapping (uint256 => Task) public tasks;
    function createTask(string memory _title, string memory _description) public {
        TaskCounter++;
        tasks[TaskCounter] = Task(TaskCounter, _title, _description, false, block.timestamp);
        emit TaskCreated(TaskCounter, _title, _description, false, block.timestamp);
    }

    function toggleDone(uint _id) public{
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit TaskToggledDone(_id, _task.done);
    }
}