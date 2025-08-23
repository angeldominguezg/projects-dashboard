import { Card } from "@/components/ui/card"

function ProjectDescription({description}: {description: string}) {
  return (
    <>
       <Card className="p-4">
          <h3 className="font-bold mb-2">Descripción del Proyecto</h3>
          <p className="text-gray-700 mb-4">{description}</p>
          <pre>
            {/* <code>{JSON.stringify(project, null, 2)}</code> */}
          </pre>
        </Card>
    </>
  )
}

export default ProjectDescription