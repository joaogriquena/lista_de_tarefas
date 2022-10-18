
const Main = { //? this = main

    tasks: [],

    init: function () {
        this.cacheSelectors()
        this.bindEvents()
        this.getStoraged()
        this.buildTasks()
    },

    //? Selecionar os elementos do HTML e criar suas variaveis
    cacheSelectors: function () {
        this.$checkButtons = document.querySelectorAll('.check')
        this.$inputTask = document.querySelector('#inputTask')
        this.$list = document.querySelector('#list')
        this.$removeButtons = document.querySelectorAll('.remove')
    },

    //? Adcionar eventos!! Ex.. Click, Enter
    bindEvents: function () {
        const self = this

        //? forEach - Para cada... Ex.. Para cada elemento do meu array
        this.$checkButtons.forEach(function (button) {
            button.onclick = self.Events.checkButton_click.bind(self)
        })

        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

        this.$removeButtons.forEach(function (button) {
            button.onclick = self.Events.removeButton_click.bind(self)
        })
    },

    getStoraged: function () {
        const tasks = localStorage.getItem('tasks')

        if (tasks) {
            this.tasks = JSON.parse(tasks)
        } else {
            localStorage.setItem('tasks', JSON.stringify([]))
        }
    },

    getTaskHtml: function (task, isDone) {
        return `
      <li class="${isDone ? 'done' : ''}" data-task="${task}">          
        <div class="check" ></div>
        <label class="task">
          ${task}
        </label>
        <button class="remove"></button>
      </li>
    `
    },

    insertHTML: function (element, htmlString) {
        element.innerHTML += htmlString

        this.cacheSelectors()
        this.bindEvents()
    },

    buildTasks: function () {
        let html = ''

        this.tasks.forEach(item => {
            html += this.getTaskHtml(item.task, item.done)
        })

        this.insertHTML(this.$list, html)
    },

    //? Funções relacionadas a eventos
    Events: {
        checkButton_click: function (e) {
            const li = e.target.parentElement
            const value = li.dataset['task']
            const isDone = li.classList.contains('done')

            const newTasksState = this.tasks.map(item => {
                if (item.task === value) {
                    item.done = !isDone
                }

                return item
            })

            localStorage.setItem('tasks', JSON.stringify(newTasksState))

            if (!isDone) {
                return li.classList.add('done')
            }

            li.classList.remove('done')
        },

        //? Função para adcionar as tasks
        inputTask_keypress: function (e) {
            const key = e.key
            const value = e.target.value
            const isDone = false

            if (key === 'Enter') {
                //? Dentro de uma função de evento Ex. 'click, mousemove, keypress', o this sempre vai ser o prorio elemento em si e não nosso objeto (Main)
                const taskHtml = this.getTaskHtml(value, isDone)

                this.insertHTML(this.$list, taskHtml)

                e.target.value = ''

                const savedTasks = localStorage.getItem('tasks')
                const savedTasksArr = JSON.parse(savedTasks)

                const arrTasks = [
                    { task: value, done: isDone },
                    ...savedTasksArr,
                ]

                const jsonTasks = JSON.stringify(arrTasks)

                this.tasks = arrTasks
                localStorage.setItem('tasks', jsonTasks)
            }
        },

        //? Função para adcionar as tasks
        removeButton_click: function (e) {
            const li = e.target.parentElement
            const value = li.dataset['task']

            console.log(this.tasks)

            const newTasksState = this.tasks.filter(item => {
                console.log(item.task, value)
                return item.task !== value
            })

            localStorage.setItem('tasks', JSON.stringify(newTasksState))
            this.tasks = newTasksState

            li.classList.add('removed')

            setTimeout(function () {
                li.classList.add('hidden')
            }, 300)
        }
    }

}

Main.init()

