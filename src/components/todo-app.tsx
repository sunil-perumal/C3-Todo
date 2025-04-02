"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

type Todo = {
  id: string
  text: string
  completed: boolean
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim() === "") return

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
    }

    setTodos([...todos, todo])
    setNewTodo("")
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const filteredTodos = todos.filter((todo) => {
    if (activeTab === "active") return !todo.completed
    if (activeTab === "completed") return todo.completed
    return true
  })

  const activeTodosCount = todos.filter((todo) => !todo.completed).length

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">To-Do List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={addTodo} className="flex space-x-2">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <PlusCircle className="h-5 w-5" />
            <span className="sr-only">Add task</span>
          </Button>
        </form>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <TodoList todos={filteredTodos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <TodoList todos={filteredTodos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <TodoList todos={filteredTodos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="justify-between text-sm text-muted-foreground">
        <div>{activeTodosCount} items left</div>
        {todos.some((todo) => todo.completed) && (
          <Button variant="ghost" size="sm" onClick={() => setTodos(todos.filter((todo) => !todo.completed))}>
            Clear completed
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

interface TodoListProps {
  todos: Todo[]
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
}

function TodoList({ todos, toggleTodo, deleteTodo }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No tasks found</p>
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between p-3 bg-background rounded-md border">
          <div className="flex items-center gap-3">
            <Checkbox id={`todo-${todo.id}`} checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
            <label
              htmlFor={`todo-${todo.id}`}
              className={`text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}
            >
              {todo.text}
            </label>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteTodo(todo.id)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete task</span>
          </Button>
        </li>
      ))}
    </ul>
  )
}

