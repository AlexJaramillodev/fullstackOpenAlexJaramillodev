const Header = ({ course }) => <h1>{course.name}</h1>;

const Total = ({ course }) => (
  <h3>
    {/*Total of exercises:{" "}
    {course.parts[0].exercises +
      course.parts[1].exercises +
    course.parts[2].exercises}*/}
    Total of exercises:{" "}
    {course.parts.reduce((sum, part) => sum + part.exercises, 0)}
  </h3>
);

// Componente Part que usa map para recorrer y renderizar cada parte
const Part = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
    </>
  );
};

{
  /*const Part = ({ part }) => {
  return (
    <div>
      <p>
        {part.name}
        {part.exercises}
      </p>
    </div>
  );
};*/
}

const Content = ({ course }) => (
  <>
    {/* Llamamos a Part solo una vez, pasando el array completo */}
    <Part parts={course.parts} />
  </>
);

{
  /*const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map((part) => (
        <Part key={part.id} part={part} />
      ))}
    </div>
  );
};
*/
}

const Course = ({ course }) => {
  console.log(course);

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  );
};

export default Course;
