# របាយការណ៍ភាពពេញលេញនៃមាតិកា (Curriculum Completeness Report)

> បង្កើតស្វ្យ័យប្រវត្តិដោយ `npm run report` — 2026-10-25T11:33:20.514Z
> សូមកុំកែដោយដៃ; កែតាមរយៈ curriculum data ហើយរត់ script នេះឡើងវិញ។

## សង្ខេប (Summary)

| រង្វាស់ | ចំនួន |
| --- | --- |
| កម្រិតសរុប | 13 |
| កម្រិតមានមាតិកា published | 3 |
| មេរៀន Published | 13 |
| មេរៀន Draft | 0 |
| មេរៀន Planned | 58 |
| លំហាត់សរុប (published) | 45 |
| ឧទាហរណ៍ C++ មាន expected output (ផ្ទៀងផ្ទាត់ដោយ g++ ក្នុង CI) | 13 |
| លំហាត់សរសេរកូដ (code challenges ជាមួយ test cases) | 6 |

## ស្ថានភាពតាមកម្រិត (Per-level status)

| កម្រិត | ឈ្មោះ | ស្ថានភាព | មេរៀន published | មេរៀន planned |
| --- | --- | --- | --- | --- |
| 0 | ការត្រៀមខ្លួន (Getting Ready) | published | 3 | 0 |
| 1 | មូលដ្ឋាន C++ (C++ Basics) | published | 5 | 0 |
| 2 | អថេរ និងទិន្នន័យ (Variables and Data) | published | 5 | 0 |
| 3 | លក្ខខណ្ឌ និងតក្កវិជ្ជា (Conditionals and Logic) | planned | 0 | 6 |
| 4 | រង្វិលជុំ (Loops) (Loops) | planned | 0 | 6 |
| 5 | មុខងារ (Functions) (Functions) | planned | 0 | 6 |
| 6 | Collections និង Strings (Collections and Strings) | planned | 0 | 6 |
| 7 | Pointers និង Memory (Pointers and Memory) | planned | 0 | 6 |
| 8 | Object-Oriented Programming (Object-Oriented Programming) | planned | 0 | 6 |
| 9 | Modern C++ (Modern C++) | planned | 0 | 6 |
| 10 | រចនាសម្ព័ន្ធទិន្នន័យ និង Algorithms (Data Structures and Algorithms) | planned | 0 | 5 |
| 11 | C++ វិជ្ជាជីវៈ (Professional C++) | planned | 0 | 6 |
| 12 | គម្រោង និងការវាយតម្លៃចុងក្រោយ (Projects and Final Assessment) | planned | 0 | 5 |

## មេរៀន Published (លម្អិត)

| Lesson ID | ចំណងជើង | លំហាត់ | ឧទាហរណ៍ | នាទី | កំណែ |
| --- | --- | --- | --- | --- | --- |
| l0-what-is-cpp | តើ C++ ជាអ្វី? | 3 | 1 | 10 | 1.0.0 |
| l0-compiler | តើ Compiler ធ្វើអ្វី? | 3 | 2 | 12 | 1.0.0 |
| l0-how-to-use | របៀបប្រើគេហទំព័រនេះ | 3 | 0 | 8 | 1.0.0 |
| l1-hello-world | Hello World — កម្មវិធីដំបូងរបស់អ្នក | 4 | 1 | 15 | 1.0.0 |
| l1-main-function | មុខងារ main() និងរចនាសម្ព័ន្ធកម្មវិធី | 3 | 1 | 12 | 1.0.0 |
| l1-statements-comments | Statements, Semicolons និង Comments | 3 | 1 | 12 | 1.0.0 |
| l1-cout-output | ការបញ្ចេញទិន្នន័យដោយ std::cout | 4 | 1 | 15 | 1.0.0 |
| l1-cin-input | ការទទួលទិន្នន័យដោយ std::cin | 4 | 1 | 15 | 1.0.0 |
| l2-variables | អថេរ (Variables) និងថេរ (Constants) | 4 | 1 | 18 | 1.0.0 |
| l2-data-types | ប្រភេទទិន្នន័យមូលដ្ឋាន (int, double, char, bool, string) | 4 | 2 | 20 | 1.0.0 |
| l2-operators | គណនាការ (Arithmetic Operators) | 4 | 1 | 18 | 1.0.0 |
| l2-assignment-comparison | ការផ្តល់តម្លៃ និងការប្រៀបធៀប | 3 | 1 | 15 | 1.0.0 |
| l2-type-conversion | ការបំលែងប្រភេទទិន្នន័យ (Type Conversion) | 3 | 1 | 15 | 1.0.0 |

## និយមន័យស្ថានភាព (Status definitions)

- **Published** — មាតិកាពេញលេញ បង្ហាញលើគេហទំព័រ មានលំហាត់ និងការពិនិត្យដោយ validation tests
- **Tested** — published មេរៀនដែលឧទាហរណ៍ C++ ទាំងអស់ត្រូវបាន compile+run ដោយ g++ 17 ក្នុង CI ជារាល់ push (មើល workflow `ci.yml`)
- **Draft** — មានមាតិកាខ្លះ ប៉ុន្តែមិនទាន់បង្ហាញ (status draft មិន render លើ site ទេ)
- **Planned** — មានតែ metadata គម្រោង UI បង្ហាញជា "កំពុងរៀបចំ" មិនអនុញ្ញាតឲ្យចូល
- **Needs revision** — គ្មានមេរៀនណាស្ថិតក្នុងស្ថានភាពនេះទេ នៅពេលរបាយការណ៍នេះបង្កើត
