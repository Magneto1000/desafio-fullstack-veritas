package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"sync"
)

// Dados para Tarefas
type Task struct {
	ID     string `json:"id"`
	Title  string `json:"title"`
	Status string `json:"status"` //  Status da tarefa: "TODO", "DOING", "DONE"
}

// Armazenamento em Memória
var (
	tasks  = make(map[string]Task)
	nextID = 1
	mu     sync.Mutex // Mutex  para proteger o acesso ao mapa de tarefas
)

// Middleware para CORS
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

// Manipulação de Rotas
func tasksHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case "GET":
		// Retorna todas as tarefas
		mu.Lock()
		taskList := make([]Task, 0, len(tasks))
		for _, task := range tasks {
			taskList = append(taskList, task)
		}
		mu.Unlock()
		json.NewEncoder(w).Encode(taskList)

	case "POST":
		// Trecho para criar uma nova tarefa
		var newTask Task
		if err := json.NewDecoder(r.Body).Decode(&newTask); err != nil {
			http.Error(w, "Dados inválidos", http.StatusBadRequest)
			return
		}

		mu.Lock()
		newTask.ID = strconv.Itoa(nextID)
		newTask.Status = "TODO" // Condição inicial da tarefa
		tasks[newTask.ID] = newTask
		nextID++
		mu.Unlock()

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(newTask)

	case "PUT":
		// Bloco para atualizar uma tarefa existente
		id := r.URL.Query().Get("id")
		var updatedData Task
		json.NewDecoder(r.Body).Decode(&updatedData)

		mu.Lock()
		task, exists := tasks[id]
		if exists {
			// Se o frontend enviar um novo status, atualiza
			if updatedData.Status != "" {
				task.Status = updatedData.Status
			}
			// Se o frontend enviar um novo título, atualiza
			if updatedData.Title != "" {
				task.Title = updatedData.Title
			}
			tasks[id] = task
		}
		mu.Unlock()

		if !exists {
			http.Error(w, "Tarefa não encontrada", http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(task)

	case "DELETE":
		// Exclui uma tarefa
		id := r.URL.Query().Get("id")
		mu.Lock()
		delete(tasks, id)
		mu.Unlock()
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
	}
}

func main() {
	// Registra a rota aplicando o CORS
	http.HandleFunc("/tasks", corsMiddleware(tasksHandler))

	fmt.Println("Servidor Go rodando na porta 8080...")
	http.ListenAndServe(":8080", nil)
}
