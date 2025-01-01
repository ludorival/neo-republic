import React from "react";
import { Program, createProgram } from "@/domain/models/program";
import messages from "../../../messages/fr.json";
import ProgramsList from "./ProgramsList";
import { auth } from "@/infra/firebase/auth";
import * as repositories from "@/infra/firebase/firestore";
import { User } from "firebase/auth";

describe("<ProgramsList />", () => {
  const mockPrograms: Program[] = [
    {
      ...createProgram({
        authorId: "hidden",
        slogan: "Economic Reform",
        description: "Comprehensive economic reform plan",
        policyAreas: messages.programs['policyAreaKeys'].split(',')
      }),
      id: "1",
      status: "published" as const,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01")
    },
    {
      ...createProgram({
        authorId: "hidden",
        slogan: "Education Reform",
        description: "Modern education system reform",
        policyAreas: messages.programs['policyAreaKeys'].split(',')
      }),
      id: "2",
      status: "published" as const,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02")
    }
  ];

  it("displays a horizontal scrollable list of program cards", () => {
    cy.mount(<ProgramsList programs={mockPrograms} />);

    cy.get('[data-testid="programs-list"]').should("exist");
    cy.get('[data-testid="programs-header"]')
      .should("exist")
      .should("contain", messages.programs.title);
    cy.get('[data-testid="programs-description"]')
      .should("exist")
      .should("contain", messages.programs.description);
    cy.get('[data-testid="programs-list"] .flex.gap-4.overflow-x-auto')
      .should("exist")
      .should("have.css", "display", "flex")
      .should("have.css", "overflow-x", "auto");
  });

  it("renders program cards with correct information", () => {
    cy.mount(<ProgramsList programs={mockPrograms} />);

    cy.get('[data-testid="program-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="program-slogan"]').should(
          "contain",
          mockPrograms[0].slogan
        );
        cy.get('[data-testid="program-description"]').should(
          "contain",
          mockPrograms[0].description
        );
      });
  });

  it("navigates to program view page when clicking a program card", () => {
    cy.mount(<ProgramsList programs={mockPrograms} />);

    cy.get('[data-testid="program-card"]').first().click();
    cy.get("@routerPush")
      .should("have.been.calledOnce")
      .and("have.been.calledWith", `/programs/${mockPrograms[0].id}`);
  });

  it("displays empty state when no programs are available", () => {
    cy.mount(<ProgramsList programs={[]} />);

    cy.get('[data-testid="programs-empty"]')
      .should("exist")
      .should("contain", messages.programs.empty);
    
    // Verify create program card is still visible
    cy.get('[data-testid="create-program-card"]')
      .should("exist")
      .should("contain", messages.programs.create.title)
      .should("contain", messages.programs.create.description);
  });

  it("displays create program card at the end of the list", () => {
    cy.mount(<ProgramsList programs={mockPrograms} />);

    cy.get('[data-testid="create-program-card"]')
      .should("exist")
      .should("contain", messages.programs.create.title);
  });

  it("displays edit button instead of create button when user has submitted program", () => {
    // Mock authenticated user with submitted program
    const mockUser = {
      displayName: "John Doe",
      email: "john@example.com",
      uid: "123",
      photoURL: null,
    };

  
    cy.stub(auth, "onAuthStateChanged").callsFake((callback) => {
        callback(mockUser);
        return () => {};
      });

    cy.mount(<ProgramsList programs={[]} />, {currentUser: {
        id: "123",
        role: "citizen",
        createdAt: new Date(),
        displayName: "John Doe",
        email: "john@example.com",
        submittedProgram: "submitted-program-id"
    }});

    // Verify edit button is present
    cy.get('[data-testid="edit-program-card"]')
      .should("exist")
      .should("contain", messages.programs.edit.title)
      .should("contain", messages.programs.edit.description);

    // Verify create button is not present
    cy.get('[data-testid="create-program-card"]').should("not.exist");
  });

  describe("Program Creation Authentication", () => {
    let stubSignInWithGoogle: sinon.SinonStub;

    beforeEach(() => {
      stubSignInWithGoogle = cy
        .stub(auth, "signInWithGoogle")
        .as("signInWithGoogle")
        .returns(
          Promise.resolve({
            uid: "123",
            email: "john@example.com",
            displayName: "John Doe",
            photoURL: "https://example.com/profile.jpg",
          })
        );
    });

    it("shows login modal when unauthenticated user clicks create program", () => {
      cy.mount(<ProgramsList programs={mockPrograms} />);

      cy.get('[data-testid="create-program-card"]').click();
      cy.get('[data-testid="login-modal"]')
        .should("exist")
        .should("be.visible");
      cy.get('[data-testid="login-modal-title"]').should(
        "contain",
        messages.auth.loginRequired
      );
      cy.get('[data-testid="login-modal-message"]').should(
        "contain",
        messages.auth.loginToCreate
      );
    });

    it("redirects to program edit page after successful authentication and program creation", () => {
      // Mock program creation
      let callback: (user: User) => void = () => {}
      const mockUser = {
        uid: "123",
        email: "john@example.com",
        displayName: "John Doe",
        photoURL: "https://example.com/profile.jpg",
      } as User
      cy.stub(auth, "onAuthStateChanged").callsFake((cb) => {
        callback = cb
        cb(null)
        return () => {};
      })
      stubSignInWithGoogle.callsFake(() => {
        callback(mockUser)
        return Promise.resolve(mockUser)
      })
      const mockProgram = {
        ...createProgram({
          authorId: mockUser.uid,
          policyAreas: messages.programs['policyAreaKeys'].split(',')
        }),
        id: "new-program-id"
      };
      cy.stub(repositories.programs, "create").resolves(mockProgram);

      cy.mount(<ProgramsList programs={mockPrograms} />);

      // Click create program, then authenticate
      cy.get('[data-testid="create-program-card"]')
        .click()
      cy.get('[data-testid="google-signin-button"]').click();

      // Verify navigation after successful auth and program creation
      cy.get("@routerPush")
        .should("have.been.calledOnce")
        .and("have.been.calledWith", "/programs/new-program-id/edit");
    });

    it("shows error message when program creation fails", () => {
      // Mock authenticated user
      const mockUser = {
        displayName: "John Doe",
        email: "john@example.com",
        uid: "123",
        photoURL: null,
      };
      cy.stub(auth, "onAuthStateChanged").callsFake((callback) => {
        callback(mockUser);
        return () => {};
      });

      // Mock program creation failure
      cy.stub(repositories.programs, "create").rejects(new Error("Failed to create program"));

      cy.mount(<ProgramsList programs={mockPrograms} />, {
        currentUser: {
          id: "123",
          role: "citizen",
          createdAt: new Date(),
          displayName: "John Doe",
          email: "john@example.com"
        }
      });

      // Click create program
      cy.get('[data-testid="create-program-card"]').click();

      // Verify error message is displayed
      cy.get('[data-testid="create-program-error"]')
        .should("exist")
        .should("contain", messages.programs.create.error);

      // Verify create button is still enabled
      cy.get('[data-testid="create-program-card"]')
        .should("exist")
        .should("not.be.disabled");
    });

    it("handles multiple creation attempts after failure", () => {
      // Mock authenticated user
      const mockUser = {
        displayName: "John Doe",
        email: "john@example.com",
        uid: "123",
        photoURL: null,
      };
      cy.stub(auth, "onAuthStateChanged").callsFake((callback) => {
        callback(mockUser);
        return () => {};
      });

      // Mock program creation to fail first then succeed
      const createStub = cy.stub(repositories.programs, "create");
      createStub.onFirstCall().rejects(new Error("Failed to create program"));
      const mockProgram = {
        ...createProgram({
          authorId: mockUser.uid,
          policyAreas: messages.programs['policyAreaKeys'].split(',')
        }),
        id: "new-program-id"
      };
      createStub.onSecondCall().resolves(mockProgram);

      cy.mount(<ProgramsList programs={mockPrograms} />, {
        currentUser: {
          id: "123",
          role: "citizen",
          createdAt: new Date(),
          displayName: "John Doe",
          email: "john@example.com"
        }
      });

      // First attempt - should fail
      cy.get('[data-testid="create-program-card"]').click();
      cy.get('[data-testid="create-program-error"]').should("exist");

      // Second attempt - should succeed
      cy.get('[data-testid="create-program-card"]').click();
      cy.get('[data-testid="create-program-error"]').should("not.exist");
      cy.get("@routerPush")
        .should("have.been.calledOnce")
        .and("have.been.calledWith", "/programs/new-program-id/edit");
    });
  });
});
