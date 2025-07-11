// Real skills learning service with actual lessons and content
export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'theory' | 'practice' | 'quiz' | 'project';
  content: LessonContent;
  duration: number; // minutes
  xp: number;
  prerequisites?: string[];
  completed: boolean;
  score?: number;
  completedAt?: string;
}

export interface LessonContent {
  theory?: {
    sections: {
      title: string;
      content: string;
      codeExample?: string;
      tips?: string[];
    }[];
  };
  practice?: {
    exercises: {
      id: string;
      question: string;
      type: 'multiple-choice' | 'code-completion' | 'drag-drop' | 'fill-blank';
      options?: string[];
      correctAnswer: string | string[];
      explanation: string;
      hint?: string;
    }[];
  };
  quiz?: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }[];
  };
  project?: {
    title: string;
    description: string;
    requirements: string[];
    starterCode?: string;
    solution?: string;
    testCases?: {
      input: string;
      expectedOutput: string;
    }[];
  };
}

export interface SkillPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'programming' | 'web' | 'mobile' | 'data' | 'design' | 'devops';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  lessons: Lesson[];
  prerequisites?: string[];
  certificate: boolean;
  popularity: number;
  rating: number;
  enrolledCount: number;
}

class SkillsLearningService {
  private skillPaths: SkillPath[] = [
    // Python Programming Path
    {
      id: 'python-basics',
      name: 'Python Programming',
      description: 'Master Python from basics to advanced concepts with hands-on projects',
      icon: '🐍',
      color: '#3776AB',
      category: 'programming',
      difficulty: 'beginner',
      estimatedHours: 40,
      certificate: true,
      popularity: 95,
      rating: 4.8,
      enrolledCount: 125000,
      lessons: [
        {
          id: 'python-intro',
          title: 'Introduction to Python',
          description: 'Learn what Python is and why it\'s popular',
          type: 'theory',
          duration: 15,
          xp: 50,
          completed: false,
          content: {
            theory: {
              sections: [
                {
                  title: 'What is Python?',
                  content: 'Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991, Python emphasizes code readability and allows programmers to express concepts in fewer lines of code.',
                  tips: [
                    'Python is great for beginners due to its simple syntax',
                    'It\'s used in web development, data science, AI, and automation',
                    'Python code is often described as "executable pseudocode"'
                  ]
                },
                {
                  title: 'Why Learn Python?',
                  content: 'Python is one of the most in-demand programming languages. It\'s used by companies like Google, Netflix, Instagram, and Spotify. Python developers earn competitive salaries and have diverse career opportunities.',
                  codeExample: `# Your first Python program
print("Hello, World!")
print("Welcome to Python programming!")`,
                  tips: [
                    'Python has a huge community and extensive libraries',
                    'Great for rapid prototyping and development',
                    'Cross-platform compatibility'
                  ]
                }
              ]
            }
          }
        },
        {
          id: 'python-variables',
          title: 'Variables and Data Types',
          description: 'Learn how to store and work with different types of data',
          type: 'practice',
          duration: 25,
          xp: 75,
          completed: false,
          prerequisites: ['python-intro'],
          content: {
            theory: {
              sections: [
                {
                  title: 'Variables in Python',
                  content: 'Variables are containers for storing data values. In Python, you don\'t need to declare the type of variable - Python figures it out automatically.',
                  codeExample: `# Creating variables
name = "Alice"
age = 25
height = 5.6
is_student = True

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Height: {height}")
print(f"Is student: {is_student}")`,
                  tips: [
                    'Variable names should be descriptive',
                    'Use snake_case for variable names',
                    'Variables are case-sensitive'
                  ]
                }
              ]
            },
            practice: {
              exercises: [
                {
                  id: 'var-1',
                  question: 'Create a variable called "favorite_color" and assign it the value "blue"',
                  type: 'code-completion',
                  correctAnswer: 'favorite_color = "blue"',
                  explanation: 'Variables are created by assigning a value using the = operator',
                  hint: 'Use the format: variable_name = value'
                },
                {
                  id: 'var-2',
                  question: 'Which of these is a valid variable name in Python?',
                  type: 'multiple-choice',
                  options: ['2name', 'my-name', 'my_name', 'my name'],
                  correctAnswer: 'my_name',
                  explanation: 'Variable names cannot start with numbers, contain hyphens, or have spaces. Use underscores instead.'
                }
              ]
            }
          }
        },
        {
          id: 'python-strings',
          title: 'Working with Strings',
          description: 'Master string manipulation and formatting',
          type: 'practice',
          duration: 30,
          xp: 100,
          completed: false,
          prerequisites: ['python-variables'],
          content: {
            theory: {
              sections: [
                {
                  title: 'String Basics',
                  content: 'Strings are sequences of characters enclosed in quotes. You can use single or double quotes.',
                  codeExample: `# Different ways to create strings
message1 = "Hello, World!"
message2 = 'Python is awesome!'
message3 = """This is a
multi-line string"""

# String operations
name = "Alice"
greeting = "Hello, " + name
print(greeting)  # Hello, Alice

# String methods
print(name.upper())  # ALICE
print(name.lower())  # alice
print(len(name))     # 5`,
                  tips: [
                    'Use f-strings for modern string formatting',
                    'Strings are immutable in Python',
                    'Triple quotes allow multi-line strings'
                  ]
                }
              ]
            },
            practice: {
              exercises: [
                {
                  id: 'str-1',
                  question: 'Complete the f-string to display "My name is John and I am 25 years old"',
                  type: 'fill-blank',
                  correctAnswer: 'f"My name is {name} and I am {age} years old"',
                  explanation: 'F-strings use curly braces {} to embed variables',
                  hint: 'Use f"text {variable} more text"'
                },
                {
                  id: 'str-2',
                  question: 'What method would you use to convert "hello" to "HELLO"?',
                  type: 'multiple-choice',
                  options: ['upper()', 'capitalize()', 'title()', 'lower()'],
                  correctAnswer: 'upper()',
                  explanation: 'The upper() method converts all characters to uppercase'
                }
              ]
            }
          }
        },
        {
          id: 'python-lists',
          title: 'Lists and Collections',
          description: 'Learn to work with lists, the most versatile data structure',
          type: 'practice',
          duration: 35,
          xp: 125,
          completed: false,
          prerequisites: ['python-strings'],
          content: {
            theory: {
              sections: [
                {
                  title: 'Introduction to Lists',
                  content: 'Lists are ordered collections that can hold multiple items. They are mutable, meaning you can change them after creation.',
                  codeExample: `# Creating lists
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, True, 3.14]

# Accessing elements
print(fruits[0])    # apple
print(fruits[-1])   # orange (last item)

# Modifying lists
fruits.append("grape")
fruits.insert(1, "kiwi")
fruits.remove("banana")

print(fruits)  # ['apple', 'kiwi', 'orange', 'grape']`,
                  tips: [
                    'Lists start counting from 0 (zero-indexed)',
                    'Use negative indices to count from the end',
                    'Lists can contain different data types'
                  ]
                }
              ]
            },
            practice: {
              exercises: [
                {
                  id: 'list-1',
                  question: 'How do you add "python" to the end of the list languages = ["java", "javascript"]?',
                  type: 'multiple-choice',
                  options: ['languages.add("python")', 'languages.append("python")', 'languages.insert("python")', 'languages.push("python")'],
                  correctAnswer: 'languages.append("python")',
                  explanation: 'The append() method adds an item to the end of a list'
                },
                {
                  id: 'list-2',
                  question: 'What is the output of: numbers = [1, 2, 3]; print(numbers[1])',
                  type: 'multiple-choice',
                  options: ['1', '2', '3', 'Error'],
                  correctAnswer: '2',
                  explanation: 'Lists are zero-indexed, so numbers[1] returns the second element'
                }
              ]
            }
          }
        },
        {
          id: 'python-loops',
          title: 'Loops and Iteration',
          description: 'Master for loops and while loops for repetitive tasks',
          type: 'practice',
          duration: 40,
          xp: 150,
          completed: false,
          prerequisites: ['python-lists'],
          content: {
            theory: {
              sections: [
                {
                  title: 'For Loops',
                  content: 'For loops are used to iterate over sequences like lists, strings, or ranges.',
                  codeExample: `# Loop through a list
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(f"I like {fruit}")

# Loop through a range
for i in range(5):
    print(f"Number: {i}")

# Loop with index
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")`,
                  tips: [
                    'Use for loops when you know how many times to iterate',
                    'range() generates sequences of numbers',
                    'enumerate() gives you both index and value'
                  ]
                },
                {
                  title: 'While Loops',
                  content: 'While loops continue executing as long as a condition is true.',
                  codeExample: `# Basic while loop
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1

# User input loop
user_input = ""
while user_input != "quit":
    user_input = input("Enter 'quit' to exit: ")
    print(f"You entered: {user_input}")`,
                  tips: [
                    'Be careful to avoid infinite loops',
                    'Always update the condition variable',
                    'Use break to exit loops early'
                  ]
                }
              ]
            },
            practice: {
              exercises: [
                {
                  id: 'loop-1',
                  question: 'Complete the code to print numbers 1 to 5: for i in _____(1, 6):',
                  type: 'fill-blank',
                  correctAnswer: 'range',
                  explanation: 'range(1, 6) generates numbers from 1 to 5 (6 is excluded)',
                  hint: 'Use the function that generates number sequences'
                },
                {
                  id: 'loop-2',
                  question: 'What will this code print? \nfor i in range(3):\n    print(i)',
                  type: 'multiple-choice',
                  options: ['1 2 3', '0 1 2', '0 1 2 3', '1 2'],
                  correctAnswer: '0 1 2',
                  explanation: 'range(3) generates 0, 1, 2 (starts at 0, stops before 3)'
                }
              ]
            }
          }
        },
        {
          id: 'python-functions',
          title: 'Functions and Code Organization',
          description: 'Learn to create reusable code with functions',
          type: 'practice',
          duration: 45,
          xp: 175,
          completed: false,
          prerequisites: ['python-loops'],
          content: {
            theory: {
              sections: [
                {
                  title: 'Creating Functions',
                  content: 'Functions are reusable blocks of code that perform specific tasks. They help organize code and avoid repetition.',
                  codeExample: `# Basic function
def greet(name):
    return f"Hello, {name}!"

# Function with multiple parameters
def calculate_area(length, width):
    area = length * width
    return area

# Function with default parameter
def introduce(name, age=25):
    return f"Hi, I'm {name} and I'm {age} years old"

# Using functions
message = greet("Alice")
print(message)  # Hello, Alice!

area = calculate_area(5, 3)
print(f"Area: {area}")  # Area: 15`,
                  tips: [
                    'Use descriptive function names',
                    'Functions should do one thing well',
                    'Return values instead of printing when possible'
                  ]
                }
              ]
            },
            practice: {
              exercises: [
                {
                  id: 'func-1',
                  question: 'Complete the function to add two numbers: def add_numbers(a, b): _____ a + b',
                  type: 'fill-blank',
                  correctAnswer: 'return',
                  explanation: 'Use return to send a value back from a function',
                  hint: 'What keyword sends a value back from a function?'
                },
                {
                  id: 'func-2',
                  question: 'What is the output of: def multiply(x, y=2): return x * y; print(multiply(5))',
                  type: 'multiple-choice',
                  options: ['5', '10', '7', 'Error'],
                  correctAnswer: '10',
                  explanation: 'multiply(5) uses the default value y=2, so 5 * 2 = 10'
                }
              ]
            }
          }
        },
        {
          id: 'python-project',
          title: 'Build a Calculator',
          description: 'Apply your Python skills to build a working calculator',
          type: 'project',
          duration: 60,
          xp: 250,
          completed: false,
          prerequisites: ['python-functions'],
          content: {
            project: {
              title: 'Simple Calculator Project',
              description: 'Create a calculator that can perform basic arithmetic operations (addition, subtraction, multiplication, division) with user input.',
              requirements: [
                'Create functions for add, subtract, multiply, and divide',
                'Handle user input for numbers and operations',
                'Display results clearly',
                'Handle division by zero error',
                'Allow multiple calculations in a loop'
              ],
              starterCode: `# Calculator Project Starter Code
def add(x, y):
    # TODO: Implement addition
    pass

def subtract(x, y):
    # TODO: Implement subtraction
    pass

def multiply(x, y):
    # TODO: Implement multiplication
    pass

def divide(x, y):
    # TODO: Implement division (handle division by zero)
    pass

def main():
    # TODO: Implement main calculator logic
    print("Welcome to Python Calculator!")
    # Your code here
    pass

if __name__ == "__main__":
    main()`,
              solution: `# Calculator Project Solution
def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def multiply(x, y):
    return x * y

def divide(x, y):
    if y == 0:
        return "Error: Cannot divide by zero!"
    return x / y

def main():
    print("Welcome to Python Calculator!")
    
    while True:
        try:
            num1 = float(input("Enter first number: "))
            operation = input("Enter operation (+, -, *, /) or 'quit' to exit: ")
            
            if operation == 'quit':
                break
                
            num2 = float(input("Enter second number: "))
            
            if operation == '+':
                result = add(num1, num2)
            elif operation == '-':
                result = subtract(num1, num2)
            elif operation == '*':
                result = multiply(num1, num2)
            elif operation == '/':
                result = divide(num1, num2)
            else:
                result = "Invalid operation!"
            
            print(f"Result: {result}")
            print("-" * 20)
            
        except ValueError:
            print("Please enter valid numbers!")

if __name__ == "__main__":
    main()`,
              testCases: [
                { input: "5, +, 3", expectedOutput: "8" },
                { input: "10, -, 4", expectedOutput: "6" },
                { input: "6, *, 7", expectedOutput: "42" },
                { input: "15, /, 3", expectedOutput: "5" },
                { input: "10, /, 0", expectedOutput: "Error: Cannot divide by zero!" }
              ]
            }
          }
        }
      ]
    },

    // JavaScript Path
    {
      id: 'javascript-fundamentals',
      name: 'JavaScript Fundamentals',
      description: 'Master modern JavaScript from basics to advanced concepts',
      icon: '⚡',
      color: '#F7DF1E',
      category: 'web',
      difficulty: 'beginner',
      estimatedHours: 35,
      certificate: true,
      popularity: 98,
      rating: 4.9,
      enrolledCount: 200000,
      lessons: [
        {
          id: 'js-intro',
          title: 'Introduction to JavaScript',
          description: 'Learn what JavaScript is and its role in web development',
          type: 'theory',
          duration: 20,
          xp: 50,
          completed: false,
          content: {
            theory: {
              sections: [
                {
                  title: 'What is JavaScript?',
                  content: 'JavaScript is a versatile programming language that runs in web browsers and servers. It\'s the language of the web, enabling interactive websites and modern web applications.',
                  codeExample: `// Your first JavaScript code
console.log("Hello, JavaScript!");
alert("Welcome to JavaScript programming!");

// Variables and basic operations
let name = "Developer";
let age = 25;
console.log(\`Hello, \${name}! You are \${age} years old.\`);`,
                  tips: [
                    'JavaScript runs in browsers and Node.js',
                    'It\'s essential for front-end development',
                    'Modern JavaScript (ES6+) has powerful features'
                  ]
                }
              ]
            }
          }
        },
        {
          id: 'js-variables',
          title: 'Variables and Data Types',
          description: 'Learn about let, const, var and JavaScript data types',
          type: 'practice',
          duration: 25,
          xp: 75,
          completed: false,
          prerequisites: ['js-intro'],
          content: {
            theory: {
              sections: [
                {
                  title: 'Modern Variable Declarations',
                  content: 'JavaScript has three ways to declare variables: var, let, and const. Modern JavaScript prefers let and const.',
                  codeExample: `// Modern variable declarations
let userName = "Alice";        // Can be reassigned
const PI = 3.14159;           // Cannot be reassigned
var oldStyle = "avoid this";   // Old style, avoid

// Data types
let number = 42;              // Number
let text = "Hello World";     // String
let isActive = true;          // Boolean
let items = [1, 2, 3];       // Array
let person = {               // Object
  name: "John",
  age: 30
};

console.log(typeof number);   // "number"
console.log(typeof text);     // "string"`,
                  tips: [
                    'Use const for values that won\'t change',
                    'Use let for values that will change',
                    'Avoid var in modern JavaScript'
                  ]
                }
              ]
            },
            practice: {
              exercises: [
                {
                  id: 'js-var-1',
                  question: 'Which keyword should you use for a value that won\'t change?',
                  type: 'multiple-choice',
                  options: ['var', 'let', 'const', 'final'],
                  correctAnswer: 'const',
                  explanation: 'const is used for constants - values that won\'t be reassigned'
                },
                {
                  id: 'js-var-2',
                  question: 'Complete: _____ age = 25; // This value might change later',
                  type: 'fill-blank',
                  correctAnswer: 'let',
                  explanation: 'Use let for variables that might be reassigned',
                  hint: 'Which keyword allows reassignment?'
                }
              ]
            }
          }
        }
      ]
    },

    // React Path
    {
      id: 'react-fundamentals',
      name: 'React Development',
      description: 'Build modern web applications with React',
      icon: '⚛️',
      color: '#61DAFB',
      category: 'web',
      difficulty: 'intermediate',
      estimatedHours: 50,
      certificate: true,
      popularity: 92,
      rating: 4.7,
      enrolledCount: 150000,
      prerequisites: ['javascript-fundamentals'],
      lessons: [
        {
          id: 'react-intro',
          title: 'Introduction to React',
          description: 'Learn what React is and why it\'s popular',
          type: 'theory',
          duration: 25,
          xp: 75,
          completed: false,
          content: {
            theory: {
              sections: [
                {
                  title: 'What is React?',
                  content: 'React is a JavaScript library for building user interfaces, especially web applications. Created by Facebook, it uses a component-based architecture and virtual DOM for efficient updates.',
                  codeExample: `// Your first React component
import React from 'react';

function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
    </div>
  );
}

export default App;`,
                  tips: [
                    'React uses JSX - JavaScript with HTML-like syntax',
                    'Components are reusable pieces of UI',
                    'React efficiently updates only what changes'
                  ]
                }
              ]
            }
          }
        }
      ]
    },

    // Data Science Path
    {
      id: 'data-science-python',
      name: 'Data Science with Python',
      description: 'Learn data analysis, visualization, and machine learning',
      icon: '📊',
      color: '#FF6B6B',
      category: 'data',
      difficulty: 'intermediate',
      estimatedHours: 60,
      certificate: true,
      popularity: 88,
      rating: 4.6,
      enrolledCount: 95000,
      prerequisites: ['python-basics'],
      lessons: [
        {
          id: 'pandas-intro',
          title: 'Introduction to Pandas',
          description: 'Learn data manipulation with Pandas library',
          type: 'theory',
          duration: 30,
          xp: 100,
          completed: false,
          content: {
            theory: {
              sections: [
                {
                  title: 'What is Pandas?',
                  content: 'Pandas is a powerful Python library for data manipulation and analysis. It provides data structures like DataFrames and Series for working with structured data.',
                  codeExample: `import pandas as pd
import numpy as np

# Creating a DataFrame
data = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [25, 30, 35],
    'City': ['New York', 'London', 'Tokyo']
}

df = pd.DataFrame(data)
print(df)

# Basic operations
print(df.head())        # First 5 rows
print(df.info())        # Data info
print(df.describe())    # Statistics`,
                  tips: [
                    'DataFrames are like Excel spreadsheets in Python',
                    'Pandas handles missing data gracefully',
                    'Great for data cleaning and preparation'
                  ]
                }
              ]
            }
          }
        }
      ]
    }
  ];

  async getSkillPaths(): Promise<SkillPath[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.skillPaths;
  }

  async getSkillPath(skillId: string): Promise<SkillPath | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.skillPaths.find(skill => skill.id === skillId) || null;
  }

  async getLesson(skillId: string, lessonId: string): Promise<Lesson | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const skill = this.skillPaths.find(s => s.id === skillId);
    if (!skill) return null;
    return skill.lessons.find(lesson => lesson.id === lessonId) || null;
  }

  async completeLesson(skillId: string, lessonId: string, score: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const skill = this.skillPaths.find(s => s.id === skillId);
    if (!skill) return false;
    
    const lesson = skill.lessons.find(l => l.id === lessonId);
    if (!lesson) return false;
    
    lesson.completed = true;
    lesson.score = score;
    lesson.completedAt = new Date().toISOString();
    
    return true;
  }

  async getUserProgress(skillId: string): Promise<{
    completedLessons: number;
    totalLessons: number;
    totalXP: number;
    currentStreak: number;
    level: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const skill = this.skillPaths.find(s => s.id === skillId);
    if (!skill) {
      return { completedLessons: 0, totalLessons: 0, totalXP: 0, currentStreak: 0, level: 1 };
    }
    
    const completedLessons = skill.lessons.filter(lesson => lesson.completed).length;
    const totalXP = skill.lessons
      .filter(lesson => lesson.completed)
      .reduce((sum, lesson) => sum + lesson.xp, 0);
    
    return {
      completedLessons,
      totalLessons: skill.lessons.length,
      totalXP,
      currentStreak: 7, // Mock streak
      level: Math.floor(totalXP / 500) + 1
    };
  }

  async getPopularSkills(): Promise<SkillPath[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.skillPaths
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 6);
  }

  async searchSkills(query: string): Promise<SkillPath[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const searchTerm = query.toLowerCase();
    return this.skillPaths.filter(skill =>
      skill.name.toLowerCase().includes(searchTerm) ||
      skill.description.toLowerCase().includes(searchTerm) ||
      skill.category.toLowerCase().includes(searchTerm)
    );
  }

  async getSkillsByCategory(category: string): Promise<SkillPath[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.skillPaths.filter(skill => skill.category === category);
  }

  async enrollInSkill(skillId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const skill = this.skillPaths.find(s => s.id === skillId);
    if (skill) {
      skill.enrolledCount += 1;
      return true;
    }
    return false;
  }
}

export const skillsLearningService = new SkillsLearningService();