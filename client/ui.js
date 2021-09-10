document.addEventListener("DOMContentLoaded", () => {
    App.init();
  });
const taskForm = document.querySelector("#taskForm");
taskForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    App.createTask(
        taskForm["Title"].value,
        taskForm["Description"].value
    );
})