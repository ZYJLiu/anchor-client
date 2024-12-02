// npx esrun generate-client.ts
// script to generate the codama client sdks from the anchor idl
// this generates both the js and rust sdks, but we are only using the js sdk
import { createFromRoot, updateProgramsVisitor } from "codama";
import { AnchorIdl, rootNodeFromAnchor } from "@codama/nodes-from-anchor";
import { renderVisitor as renderRustVisitor } from "@codama/renderers-rust";
import anchorIdl from "./example.json";

const rootNode = rootNodeFromAnchor(anchorIdl as AnchorIdl);
const codama = createFromRoot(rootNode);
codama.update(
  updateProgramsVisitor({
    counterProgram: { name: "counter" },
  })
);

// Generate the client sdks at the given path
codama.accept(renderRustVisitor("../rust/src/generated"));
