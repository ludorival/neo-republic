import React from "react";
import { Program } from "@/domain/models/program";
import messages from "../../../messages/fr.json";
import ProgramsList from "./ProgramsList";
import { auth } from "@/infra/firebase/auth";
import * as repositories from "@/infra/firebase/firestore";
import { User } from "firebase/auth";

describe("<ProgramsList />", () => {
  const mockPrograms: Program[] = [
    {
      id: "1",
      slogan: "Economic Reform",
      description: "Comprehensive economic reform plan",
      status: "published" as const,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      authorId: "hidden",
      policyAreas: {
        economy: {
          id: "economy",
          title: "Economic Reform",
          description: "Economic policy area",
          objectives: []
        }
      },
      financialValidation: {
        totalBudget: 0,
        isBalanced: false,
        reviewComments: []
      },
      metrics: {
        publicSupport: 0,
        feasibilityScore: 0,
        votes: 0
      }
    },
    {
      id: "2",
      slogan: "Education Reform",
      description: "Modern education system reform",
      status: "published" as const,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
      authorId: "hidden",
      policyAreas: {
        education: {
          id: "education",
          title: "Education Reform",
          description: "Education policy area",
          objectives: []
        }
      },
      financialValidation: {
        totalBudget: 0,
        isBalanced: false,
        reviewComments: []
      },
      metrics: {
        publicSupport: 0,
        feasibilityScore: 0,
        votes: 0
      }
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
      const mockProgram = { ...mockPrograms[0], id: "new-program-id" };
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

    it("creates draft program and updates user submittedProgram when authenticated user clicks create program", () => {
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

      // Mock program creation
      const mockProgram = { ...mockPrograms[0], id: "new-program-id" };
      cy.stub(repositories.programs, "create").resolves(mockProgram);

      cy.mount(<ProgramsList programs={mockPrograms} />);

      cy.get('[data-testid="create-program-card"]').click();

      // Verify user update was called with correct program ID
      cy.get("@updateUser")
        .should("have.been.calledOnce")
        .and("have.been.calledWith", mockUser.uid, {
          submittedProgram: mockProgram.id
        });

      // Verify navigation
      cy.get("@routerPush")
        .should("have.been.calledOnce")
        .and("have.been.calledWith", "/programs/new-program-id/edit");
    });

    it("shows error message when authentication fails during program creation", () => {
      // Update stub to reject with error
      stubSignInWithGoogle.rejects(new Error("Authentication failed"));

      cy.mount(<ProgramsList programs={mockPrograms} />);

      // Click create program, then try to authenticate
      cy.get('[data-testid="create-program-card"]').click();
      cy.get('[data-testid="google-signin-button"]').click();

      // Verify error message is shown
      cy.get('[data-testid="error-message"]')
        .should("exist")
        .should("be.visible")
        .should("have.text", messages.auth.error);

      // Verify we stay on the same page
      cy.get('[data-testid="login-modal"]').should("be.visible");
    });
  });
});
