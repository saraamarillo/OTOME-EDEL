/**
 * Carga un JSON de escena desde /src/data/scenes/<sceneId>.json.
 * Los JSONs se importan dinámicamente para no bundlear todo de golpe.
 *
 * Formato esperado de un JSON de escena:
 * {
 *   "id": "scene_01_campus",
 *   "background": "campus_dia",          // nombre sin extensión de /assets/backgrounds/
 *   "nodes": [
 *     {
 *       "id": "node_001",
 *       "type": "dialogue",              // "dialogue" | "choice" | "thought" | "narration"
 *       "character": "ethan",            // id del NPC (omitir en narración/pensamiento)
 *       "text": "...",
 *       "next": "node_002"               // id del nodo siguiente (null si choices)
 *     },
 *     {
 *       "id": "node_002",
 *       "type": "choice",
 *       "character": null,
 *       "text": null,
 *       "choices": [
 *         {
 *           "label": "...",
 *           "affinityChanges": { "ethan": 5 },
 *           "next": "node_003a"
 *         },
 *         {
 *           "label": "...",
 *           "affinityChanges": { "ethan": -3 },
 *           "next": "node_003b"
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export async function loadScene(sceneId) {
  const module = await import(`../data/scenes/${sceneId}.json`)
  return module.default
}

/** Encuentra un nodo por id dentro de una escena ya cargada. */
export function findNode(scene, nodeId) {
  return scene.nodes.find((n) => n.id === nodeId) ?? null
}
